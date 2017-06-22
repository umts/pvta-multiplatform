import { Component } from '@angular/core';

import { NavController, NavParams, ModalController, ToastController, Toast, AlertController } from 'ionic-angular';
import { RouteService } from '../../providers/route.service';
import { VehicleService } from '../../providers/vehicle.service';
import { AlertService } from '../../providers/alert.service';
import { FavoriteRouteService } from '../../providers/favorite-route.service';
import { RouteDetail } from '../../models/route-detail.model';
import { Vehicle } from '../../models/vehicle.model';
import { Alert } from '../../models/alert.model';
import { Stop } from '../../models/stop.model';
import { RouteMapComponent } from '../route-map/route-map.component';
import { StopModal, StopModalRequester } from '../../modals/stop-modal/stop.modal';
import { ConnectivityService } from '../../providers/connectivity.service';
import * as _ from 'lodash';

declare var ga;

@Component({
  selector: 'page-route',
  templateUrl: 'route.html'
})
export class RouteComponent {
  toast: Toast;
  routeId: number;
  route: RouteDetail;
  vehicles: Vehicle[];
  alerts: Alert[];
  stops: Stop[];
  constructor(public navCtrl: NavController, private navParams: NavParams,
    private routeService: RouteService, private vehicleService: VehicleService,
    private alertService: AlertService, private connection: ConnectivityService,
    private modalCtrl: ModalController, private favoriteRouteService: FavoriteRouteService,
    private toastCtrl: ToastController, private alertCtrl: AlertController) {
    this.routeId = parseInt(navParams.get('routeId'), 10);
    this.alerts = [];
    ga('set', 'page', '/route.html');
    ga('send', 'pageview');
  }

  showToast(message: string): void {
    if (this.toast) {
      this.toast.dismissAll();
    }

  this.toast = this.toastCtrl.create({
    message: message,
    position: 'bottom',
    showCloseButton: true
     });
    this.toast.present();
  }

  getVehicles(refresher): void {
    console.log('getvehicles', refresher);
    this.vehicleService.getRouteVehicles(this.routeId)
      .then(vehicles => {
        this.vehicles = vehicles;
        refresher.complete();
      });
  }
  /**
  * Download any Alerts for the current route
  * and display them.
  */
  getAlerts (): void {
    this.alerts = [];
    this.alertService
    .getAlerts().then(alerts => {
      if (!alerts) {
        return;
      }
      for (let alert of alerts) {
        if (_.includes(alert.Routes, this.routeId)) {
          this.alerts.push(alert);
        }
      }
    });
  }

  toggleRouteHeart(route): void {
    this.favoriteRouteService.toggleFavorite(route);
    if (route.Liked) {
      this.showToast('Route added to Favorites');
    }
    else this.showToast('Route removed from Favorites');
  }

  showStopModal (): void {
    let stopModal = this.modalCtrl.create(StopModal,
      {
        title: `Stops on the ${this.route.RouteAbbreviation}`,
        requester: StopModalRequester.Route,
        stops: this.stops
      }
    );
    stopModal.present();
  }

  goToRouteMapPage(): void {
    this.navCtrl.push(RouteMapComponent, {
      routeId: this.routeId
    }).catch(() => {
      this.alertCtrl.create({
        title: 'No Connection',
        subTitle: 'The Route Map page requires an Internet connection',
        buttons: ['Dismiss']
      }).present();
    });
  }

  ionViewCanEnter(): boolean {
   return this.connection.getConnectionStatus();
  }

  ionViewWillEnter() {
    this.getAlerts();
    this.routeService.getRouteDetail(this.routeId).then(route => {
      if (!route) {
        return;
      }
      this.route = route;
      this.stops = route.Stops;
      this.vehicles = route.Vehicles;
      this.favoriteRouteService.contains(route, (liked) => {
        this.route.Liked = liked;
      });
      ga('send', 'event', 'RouteLoaded',
      'RouteComponent.ionViewWillEnter', `Route: ${route.RouteAbbreviation} (${this.routeId})`);
    });
  }
}
