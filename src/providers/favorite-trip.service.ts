import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
  Generated class for the FavoriteTripService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FavoriteTripService {

  constructor(public http: Http, private storage: Storage) {
    console.log('Hello FavoriteTripService Provider');
  }

  saveTrip(params: any): void {
    this.storage.ready().then(() => {
      this.storage.get('savedTrips').then((savedTrips: any[]) => {
        if (savedTrips) {
          savedTrips.push(params);
          this.storage.set('savedTrips', savedTrips);
        }
        else {
          let savedTrips = [params];
          this.storage.set('savedTrips', savedTrips);
        }
      });
    });
  }
}
