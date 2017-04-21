import { Storage } from '@ionic/storage';
import localforage from 'localforage';

// INCREMENT THIS whenever you alter the database
let currentVersion = 0;

export function performMigrations(runningInBrowser: boolean) {
  this.storage.ready().then(() => {
    this.storage.get('previousVersion').then(previousVersion => {
      if (!previousVersion) previousVersion = currentVersion;
      // For every database change added to the app since the user
      // was last here, make those changes to their device's storage.
      // New users will never enter the loop.
      for (let version = previousVersion; version < currentVersion; version++) {
        // Perform each schema update here
        if (version === 0) {
          // The first database version for PVTrAck 2.0+.
          // This migration runs when a user is new or is coming from
          // PVTrAck 1.x.
          getOldFavorites(runningInBrowser);
        }
      }
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
