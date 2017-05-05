import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Route } from '../models/route.model';
import * as _ from 'lodash';
@Injectable()
export class FavoriteRouteService {
/* Checks to see if a route is included
 * in the favorites. Returns boolean.
 */
 constructor(private storage: Storage) {}

 add(route: Route): void {
   this.storage.ready().then(() => {
     this.storage.get('favoriteRoutes').then((favoriteRoutes) => {
       var newRoute = {
        RouteId: route.RouteId,
        GoogleDescription: route.GoogleDescription,
        ShortName: route.ShortName,
        RouteAbbreviation: route.RouteAbbreviation,
        Color: route.Color
      };

      if (favoriteRoutes) {
        favoriteRoutes.push(newRoute);
        this.storage.set('favoriteRoutes', favoriteRoutes);
      } else {
        this.storage.set('favoriteRoutes', [newRoute]);
      }
    });
   });
  }

  contains(route: Route, cb: Function): void {
    this.storage.ready().then(() => {
      this.storage.get('favoriteRoutes').then((routes) => {
        if (routes) {
          if (_.find(routes, {RouteId: route.RouteId})) {
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
  // Removes a route from the user's Favorites.
  // @param favoriteRoute - a Route object.
  remove(routeToRemove: Route): void {
    // First, load the existing list of favorite routes.
    this.storage.ready().then(() => {
      this.storage.get('favoriteRoutes').then(favoriteRoutes => {
        // Go through the list until we find the one we're trying to remove.
        for (var i = 0; i < favoriteRoutes.length; i++) {
          if (favoriteRoutes[i].RouteId === routeToRemove.RouteId) {
            favoriteRoutes.splice(i, 1);
          }
        }
        // Save the new list, which has the desired route removed.
        this.storage.set('favoriteRoutes', favoriteRoutes);
      });
    });
  }

  toggleFavorite(route: Route): void {
    this.contains(route, (wasFavorited: boolean) => {
      console.log('route being favd', route);
      console.log('routewasalreadyfavorited', wasFavorited);
      if (wasFavorited) {
        this.remove(route);
      } else {
        this.add(route);
      }
    });
  }
}

export class FavoriteRouteModel {
  routeId;
  googleDescription;
  shortName;
  routeAbbreviation;
  color;
  constructor(routeId: number, googleDescription: string, shortName: string, routeAbbreviation: string,
  color: string) {

  }
}
