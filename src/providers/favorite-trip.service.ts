import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class FavoriteTripService {

  constructor(private storage: Storage) { }

  saveTrip(params: any): void {
    this.storage.ready().then(() => {
      this.storage.get('savedTrips').then((savedTrips: any[]) => {
        console.log('saved trips before',savedTrips);
        if (savedTrips) {
          savedTrips.push(params);
          console.log('trip existed, now is',savedTrips);
          this.storage.set('savedTrips', savedTrips);
        }
        else {
          let savedTrips = [params];
          console.log('trip didnt exist, now is',savedTrips);
          this.storage.set('savedTrips', savedTrips);
        }
      });
    });
  }
}
