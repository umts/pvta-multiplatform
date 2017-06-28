import { Storage } from '@ionic/storage';
import localforage from 'localforage';

// INCREMENT THIS whenever you alter the database
let currentVersion = 1;
let storage: Storage;

export function performMigrations(runningInBrowser: boolean, storageInstance: Storage) {
  storage = storageInstance;
  storage.ready().then(() => {
    storage.get('previousVersion').then(previousVersion => {
      // If the user has never used PVTrAck 2.0+ before,
      // assume that they're all up-to-date
      if (!previousVersion) previousVersion = currentVersion;
      // Unfortunately, we must concern ourselves with users coming
      // from PVTrAck 1.x.  If they are a returning user
      // (this bool was set by 1.x), then we have to run
      // all the migrations on their data.
      localforage.getItem('returningUser').then(returningUser => {
        // This would indicate that a user from 1.x is using 2.x
        // for the first time.
        if (returningUser) {
          // Run all the migrations!
          previousVersion = 0;
        }
        // For every database change added to the app since the user
        // was last here, make those changes to their device's storage.
        // New users will never enter the loop.
        for (let version = previousVersion; version < currentVersion; version++) {
          // Perform each schema update here
          if (version === 0) {
            // The first database version for PVTrAck 2.0+.
            // This migration runs only when a user is coming from PVTrAck 1.x.
            getOldFavorites(runningInBrowser);
          }
        }
        // Update the user's current DB version after running
        // the migrations.
        storage.set('previousVersion', currentVersion);
      });
    });
  });
}
/*
 * The database migration for db version 0
 */
function getOldFavorites(runningInBrowser: boolean): void {
  // Only do this specific migration if we're a native app.
  // Regardless of device type, we're no longer worried about
  // whether the user is coming from 1.x
  localforage.removeItem('returningUser');
  if (!runningInBrowser) {
    storage.ready().then(() => {
      // Only do this migration if this device is capable of using
      // native SQLite storage
      // (ionic falls back to localforage if not, in which case we're done)
      if (storage.driver === 'sqlite'
      || storage.driver === 'cordovaSQLiteDriver') {
        // Move each thing from PVTrAck 1.x's storage to 2.0's.
        localforage.iterate((value, key, iterationNumber) => {
          storage.set(key, value);
        }).then(() => {
          // In success, we no longer need 1.x's storage.
          localforage.clear();
        }).catch((err) => {
          console.error(err);
        });
      }
    });
  }
}
