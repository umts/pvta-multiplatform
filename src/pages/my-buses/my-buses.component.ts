import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StopComponent } from '../stop/stop.component';
import { RouteComponent } from '../route/route.component';
import { FavoriteRouteService } from '../../providers/favorite-route.service';
import { AlertService } from '../../providers/alert.service';
import { Alert } from '../../models/alert.model';
import { MyBusesStopModal, StopModalRequester } from '../../modals/stop-modal/stop.modal';
import * as _ from 'lodash';

@Component({
  selector: 'page-my-buses',
  templateUrl: 'my-buses.html'
})
export class MyBusesComponent {
  routes;
  stops;
  alerts: Alert[];

  constructor(public navCtrl: NavController, private storage: Storage,
    private alertService: AlertService,
    private modalCtrl: ModalController) {
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
    this.alertService.getAlerts().then(alerts => {
      for (let alert of alerts) {
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
      console.log(this.alerts);
      // Finally, remove any duplicates.  Use the ID of the alert to
      // determine whether we've encountered a duplicate.
      this.alerts = _.uniqBy(alerts, (alert) => {
        return alert.MessageId;
      });
    });
  }

  ionViewWillEnter() {
    this.storage.ready().then(() => {
      this.storage.get('favoriteRoutes').then(favoriteRoutes => {
        this.routes = favoriteRoutes;
        this.filterAlerts();
      });
      this.storage.get('favoriteStops').then(favoriteStops => {
        this.stops = favoriteStops;
      })
    })
  }

  showStopModal (): void {
    let stopModal = this.modalCtrl.create(MyBusesStopModal,
      {
        requester: StopModalRequester.MyBuses,
        title: 'Add Favorite Stops'
      }
    );
    stopModal.present();
  }

  goToStopPage(stopId: number): void {
    this.navCtrl.push(StopComponent, {
      stopId: stopId
    });
  }
  goToRoutePage(routeId: number): void {
    this.navCtrl.push(RouteComponent, {
      routeId: routeId
    });
  }
}
