import { Component } from '@angular/core';

import { NavController, ModalController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StopComponent } from '../stop/stop.component';
import { RouteComponent } from '../route/route.component';
import { PlanTripComponent } from '../plan-trip/plan-trip.component';
import { AlertService } from '../../providers/alert.service';
import { FavoriteTripService } from '../../providers/favorite-trip.service';
import { FavoriteRouteService } from '../../providers/favorite-route.service';
import { FavoriteStopService } from '../../providers/favorite-stop.service';
import { Alert } from '../../models/alert.model';
import { StopModal, StopModalRequester } from '../../modals/stop-modal/stop.modal';
import { RouteModal, RouteModalRequester } from '../../modals/route-modal/route.modal';
import * as _ from 'lodash';

declare var ga;

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesComponent {
  routes;
  stops;
  alerts: Alert[];
  trips;
  constructor(public navCtrl: NavController, private storage: Storage,
    private alertSvc: AlertService, private alertCtrl: AlertController,
    private modalCtrl: ModalController, private faveTripSvc: FavoriteTripService,
    private faveRouteSvc: FavoriteRouteService, private faveStopSvc: FavoriteStopService) {
      this.alerts = [];
      ga('set', 'page', '/favorites.html');
      ga('send', 'pageview');
    }

  private filterAlerts(): void {
    /* Given a list of routes and a $promise
   * for gettings alerts from avail, only
   * display alerts for these RouteIds.
   */
    let routeIds = _.map(this.routes, 'RouteId');
    // Resolve the promise, which will contain
    // a list of all alerts
    this.alertSvc.getAlerts().then(downloadedAlerts => {
      if (!downloadedAlerts) {
        return;
      }
      for (let alert of downloadedAlerts) {
        /* If the Routes property of an
         * alert contains any of RouteIDs
         *  in question (aka the list of
         * RouteIds of the user's favorite
         * routes), push it.
         *
         *  ****NOTE****
         * This algorithm will cause an alert
         * to be displayed as many times as
         * a RouteId from the input array appears
         * in the alert's Routes array.
         *
         * For example: if Avail screws up
         * and an alert has a Routes property
         *  = [20030, 20031, 20030]
         * and the route 30 is in the input
         * routes array, this alert will
         * appear on the page twice.
         */

         // Also if there are no routes for that alert , show it by default
        if (alert.Routes.length === 0) {
          console.log('no orutes for alert');
          this.alerts.push(alert);
        } else {
          for (let routeId of alert.Routes) {
            if (_.includes(routeIds, routeId)) {
              this.alerts.push(alert);
            }
          }
        }
      }
      // Finally, remove any duplicates.  Use the ID of the alert to
      // determine whether we've encountered a duplicate.
      this.alerts = _.uniqBy(this.alerts, (alert) => {
        return alert.MessageId;
      });
    });
  }

  ionViewWillEnter() {
    this.getFavoriteRoutes();
    this.getFavoriteStops();
    this.getSavedTrips();
  }

  getFavoriteRoutes(): void {
    this.storage.ready().then(() => {
      this.storage.get('favoriteRoutes').then(favoriteRoutes => {
        this.routes = favoriteRoutes;
        this.filterAlerts();
      });
    });
  }
  getFavoriteStops(): void {
    this.storage.ready().then(() => {
      this.storage.get('favoriteStops').then(favoriteStops => {
        this.stops = favoriteStops;
      });
    });
  }
  getSavedTrips(): void {
    this.faveTripSvc.getSavedTrips().then(savedTrips => {
      this.trips = savedTrips;
    });
  }

  showStopModal(): void {
    let stopModal = this.modalCtrl.create(StopModal,
      {
        requester: StopModalRequester.Favorites,
        title: 'Add Favorite Stops'
      }
    );
    stopModal.present();
    stopModal.onDidDismiss(() => {this.getFavoriteStops(); });
  }

  showRouteModal(): void {
    let routeModal = this.modalCtrl.create(RouteModal,
      {
        requester: RouteModalRequester.Favorites,
        title: 'Add Favorite Routes'
      }
    );
    routeModal.present();
    routeModal.onDidDismiss(() => {this.getFavoriteRoutes(); });
  }

  goToStopPage(stopId: number): void {
    this.navCtrl.push(StopComponent, {
      stopId: stopId
    }).catch(() => {
      this.alertCtrl.create({
        title: 'No Connection',
        subTitle: 'The Stop page requires an Internet connection',
        buttons: ['Dismiss']
      }).present();
    });
  }

  goToRoutePage(routeId: number): void {
    this.navCtrl.push(RouteComponent, {
      routeId: routeId
    }).catch(() => {
      this.alertCtrl.create({
        title: 'No Connection',
        subTitle: 'The Route page requires an Internet connection',
        buttons: ['Dismiss']
      }).present();
    });
  }

  goToTripPage(trip): void {
    this.navCtrl.push(PlanTripComponent, {
      loadedTrip: trip
    });
  }
  deleteTrip(trip): void {
    _.remove(this.trips, {name: trip.name});
    this.faveTripSvc.deleteTrip(trip);
  }
  removeRoute(route): void {
    _.remove(this.routes, {name: route.name});
    this.faveRouteSvc.remove(route);
  }
  removeStop(stop): void {
    _.remove(this.stops, {stopId: stop.StopId});
    this.faveStopSvc.remove(stop.StopId);
  }
}
