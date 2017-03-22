import { Component } from '@angular/core';

import { NavController, ModalController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StopComponent } from '../stop/stop.component';
import { RouteComponent } from '../route/route.component';
import { PlanTripComponent } from '../plan-trip/plan-trip.component';
import { AlertService } from '../../providers/alert.service';
import { RouteService } from '../../providers/route.service';
import { StopService } from '../../providers/stop.service';
import { FavoriteTripService } from '../../providers/favorite-trip.service';
import { Alert } from '../../models/alert.model';
import { StopModal, StopModalRequester } from '../../modals/stop-modal/stop.modal';
import { RouteModal, RouteModalRequester } from '../../modals/route-modal/route.modal';
import * as _ from 'lodash';

@Component({
  selector: 'page-my-buses',
  templateUrl: 'my-buses.html'
})
export class MyBusesComponent {
  routes;
  stops;
  alerts: Alert[];
  trips;

  constructor(public navCtrl: NavController, private storage: Storage,
    private alertSvc: AlertService, private alertCtrl: AlertController,
    private modalCtrl: ModalController, private routeSvc: RouteService,
    private stopSvc: StopService, private tripSvc: FavoriteTripService) {
      this.alerts = [];
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

         //Also if there are no routes for that alert , show it by default
        if (alert.Routes.length == 0) {
          console.log('no orutes for alert');
          this.alerts.push(alert);
        }

        else {
          for (let routeId of alert.Routes) {
            if (routeIds.includes(routeId)) {
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
    this.storage.ready().then(() => {
      this.storage.get('savedTrips').then(savedTrips => {
        this.trips = savedTrips;
      });
    });
  }

  showStopModal(): void {
    let stopModal = this.modalCtrl.create(StopModal,
      {
        requester: StopModalRequester.MyBuses,
        title: 'Add Favorite Stops'
      }
    );
    stopModal.present();
    stopModal.onDidDismiss(() => {this.getFavoriteStops(); });
  }

  showRouteModal(): void {
    let routeModal = this.modalCtrl.create(RouteModal,
      {
        requester: RouteModalRequester.MyBuses,
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
        subTitle: 'The stop page requires an internet connection',
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
        subTitle: 'The route page requires an internet connection',
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
    this.tripSvc.deleteTrip(trip);
  }
}
