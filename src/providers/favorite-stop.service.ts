import { Injectable } from '@angular/core'
import { Storage } from '@ionic/storage';
import { Stop } from '../models/stop.model';
import * as _ from 'lodash';
@Injectable()
export class FavoriteStopService {
/* Checks to see if a stop is included
 * in the favorites. Returns boolean.
 */
 constructor(private storage: Storage){}

 add(stop: Stop): void {
   this.storage.ready().then(() => {
     this.storage.get('favoriteStops').then((favoriteStops) => {
       var newStop = {
        StopId: stop.StopId,
        Description: stop.Description
      };

      if (favoriteStops) {
        favoriteStops.push(newStop);
        this.storage.set('favoriteStops', favoriteStops);
      }
      else {
        this.storage.set('favoriteStops', [newStop]);
      }
    })
   })
  }

  contains(stop: Stop, cb: Function): void {
    this.storage.ready().then(() => {
      this.storage.get('favoriteStops').then((stops) => {
        if (stops) {
          if (_.find(stops, {StopId: stop.StopId})) {
            cb(true);
          } else {
            cb(false);
          }
        } else {
          cb(false);
        }
      })
    })
  }
  // Removes a stop from the user's Favorites.
  // @param favoritestop - a stop object.
  remove(stopToRemove: Stop): void {
    // First, load the existing list of favorite stops.
    this.storage.ready().then(() => {
      this.storage.get('favoriteStops').then(favoriteStops => {
        // Go through the list until we find the one we're trying to remove.
        for (var i = 0; i < favoriteStops.length; i++) {
          if (favoriteStops[i].StopId === stopToRemove.StopId) {
            favoriteStops.splice(i, 1);
          }
        }
        // Save the new list, which has the desired Stop removed.
        this.storage.set('favoriteStops', favoriteStops);
      })
    })
  }

  toggleFavorite(stop: Stop): void {
    this.contains(stop, (wasFavorited: boolean) => {
      console.log('stop being favd',stop);
      console.log('stopwasalreadyfavorited', wasFavorited);
      if (wasFavorited) {
        this.remove(stop);
      } else {
        this.add(stop);
      }
    })
  }
}

export class FavoriteStopModel {
  StopId;
  Description;
  constructor(stopId: number, Description: string) {}
}
