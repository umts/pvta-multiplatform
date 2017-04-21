import { Storage } from '@ionic/storage';
import localforage from 'localforage';

// INCREMENT THIS whenever you alter the database
let currentVersion = 0;

export function performMigrations(runningInBrowser: boolean) {
  this.storage.ready().then(() => {
    this.storage.get('previousVersion').then(previousVersion => {
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
        for (let version = previousVersion; version <= currentVersion; version++) {
          // Perform each schema update here
          if (version === 0) {
            // The first database version for PVTrAck 2.0+.
            // This migration runs only when a user is coming from PVTrAck 1.x.
            getOldFavorites(runningInBrowser);
          }
        }
      });
    })
  });
}
function getOldFavorites(runningInBrowser: boolean): void {
  if (!runningInBrowser) {
    this.storage.ready().then(() => {
      console.log(this.storage.driver);
      if (this.storage.driver === 'sqlite'
      || this.storage.driver === 'cordovaSQLiteDriver') {
        localforage.iterate((value, key, iterationNumber) => {
          // Resulting key/value pair -- this callback
          // will be executed for every item in the
          // database.
          console.log([key, value]);
          this.storage.set(key, value);
        }).then(() =>{
          console.log('Iteration has completed');
          localforage.clear();
          this.storage.set('previousVersion', currentVersion);
        }).catch((err) => {
          // This code runs if there were any errors
          console.log(err);
        });
      }
    });
  }
}
