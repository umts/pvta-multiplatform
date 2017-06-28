import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
@Injectable()
export class FavoriteStopService {
/* Checks to see if a stop is included
 * in the favorites. Returns boolean.
 */
 constructor(private storage: Storage) {}

 add(stopId: any, description: string): void {
   this.storage.ready().then(() => {
     this.storage.get('favoriteStops').then((favoriteStops) => {
       var newStop = {
        StopId: stopId,
        Description: description
      };

      if (favoriteStops) {
        favoriteStops.push(newStop);
        this.storage.set('favoriteStops', favoriteStops);
      } else {
        this.storage.set('favoriteStops', [newStop]);
      }
    });
   });
  }

  contains(stopId: any, cb: Function): void {
    this.storage.ready().then(() => {
      this.storage.get('favoriteStops').then((stops) => {
        if (stops) {
          if (_.find(stops, {StopId: stopId})) {
            cb(true);
          } else {
            cb(false);
          }
        } else {
          cb(false);
        }
      });
    });
  }
  // Removes a stop from the user's Favorites.
  // @param favoritestop - a stop object.
  remove(stopIdToRemove: any): void {
    // First, load the existing list of favorite stops.
    this.storage.ready().then(() => {
      this.storage.get('favoriteStops').then(favoriteStops => {
        // Go through the list until we find the one we're trying to remove.
        for (var i = 0; i < favoriteStops.length; i++) {
          if (favoriteStops[i].StopId === stopIdToRemove) {
            favoriteStops.splice(i, 1);
          }
        }
        // Save the new list, which has the desired Stop removed.
        this.storage.set('favoriteStops', favoriteStops);
      });
    });
  }

  toggleFavorite(stopId: any, description: string): void {
    this.contains(stopId, (wasFavorited: boolean) => {
      if (wasFavorited) {
        this.remove(stopId);
      } else {
        this.add(stopId, description);
      }
    });
  }
}

export class FavoriteStopModel {
  StopId;
  Description;
  constructor(stopId: number, Description: string) {}
}
