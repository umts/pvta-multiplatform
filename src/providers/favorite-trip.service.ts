import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';

@Injectable()
export class FavoriteTripService {

  /**
   * NOTE to maintain compatibility with trips saved in 1.x, we always save
   * trips as stringified versions of their objects and parse them when loading.
   */

  constructor(private storage: Storage) { }
  getSavedTrips(): Promise<any> {
    return this.storage.ready().then(() => {
      return this.storage.get('savedTrips').then(savedTrips => {
        return JSON.parse(savedTrips);
      });
    });
  }

  saveTrip(params: any): void {
    this.storage.ready().then(() => {
      this.storage.get('savedTrips').then((loadedTrips: string) => {
        if (loadedTrips) {
          let savedTrips: any[] = JSON.parse(loadedTrips);
          savedTrips.push(params);
          this.storage.set('savedTrips', JSON.stringify(savedTrips));
        } else {
          let savedTrips = [params];
          this.storage.set('savedTrips', JSON.stringify(savedTrips));
        }
      });
    });
  }
  deleteTrip(params: any): void {
    this.storage.ready().then(() => {
      this.storage.get('savedTrips').then((loadedTrips: string) => {
        if (loadedTrips) {
          let savedTrips = JSON.parse(loadedTrips);
          _.remove(savedTrips, {name: params.name});
          this.storage.set('savedTrips', JSON.stringify(savedTrips));
        }
      });
    });
  }
}
