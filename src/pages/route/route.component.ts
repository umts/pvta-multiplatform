import { Component } from '@angular/core';

import { NavController, Platform, NavParams, ModalController, ViewController } from 'ionic-angular';
import { RouteService } from '../../providers/route.service';
import { VehicleService } from '../../providers/vehicle.service';
import { AlertService } from '../../providers/alert.service';
import { RouteDetail } from '../../models/route-detail.model';
import { Vehicle } from '../../models/vehicle.model';
import { Alert } from '../../models/alert.model';
import { Stop } from '../../models/stop.model';
import { VehicleComponent } from './vehicle.component';
import { StopModal } from './stop.modal';
import * as _ from 'lodash';

@Component({
  selector: 'page-route',
  templateUrl: 'route.html'
})
export class RouteComponent {
  routeId: number;
  route: RouteDetail;
  vehicles: Vehicle[];
  alerts: Alert[];
  stops: Stop[];
  constructor(public navCtrl: NavController, private navParams: NavParams,
    private routeService: RouteService, private vehicleService: VehicleService,
    private alertService: AlertService,
    private modalCtrl: ModalController) {
    this.routeId = navParams.get('routeId');
    this.alerts = [];
  }

  getVehicles (): void {
    // this.vehicleService
    //   .getRouteVehicles(this.routeId)
    //   .then(vehicles => this.vehicles = vehicles);
  }
  /**
  * Download any Alerts for the current route
  * and display them.
  */
  getAlerts (): void {
    this.alertService
    .getAlerts()
    .then(alerts => {
      for (let alert of alerts) {
        console.log(alert.Routes.includes(this.routeId));
        if (alert.Routes.includes(this.routeId)) {
          this.alerts.push(alert);
        }
      }
      console.log(JSON.stringify(this.alerts));
    });
  }

  showStopModal (): void {
    let stopModal = this.modalCtrl.create(StopModal, {stops: this.stops});
    stopModal.present();
 }


  prepareStops (stops: Stop[]): void {
    this.stops = stops;
    // $scope.stops = [];
    // FavoriteStops.getAll().then(function (favoriteStops) {
    //   var favoriteStopIds = _.pluck(favoriteStops, 'StopId');
    //   for (var index = 0; index < stops.length; index++) {
    //     var stop = stops[index];
    //     var liked = false;
    //     // If the ID of the stop in question is in the list of favorite stop IDs
    //     if (_.contains(favoriteStopIds, stop.StopId)) {
    //       liked = true;
    //     }
    //     $scope.stops.push({StopId: stop.StopId, Description: stop.Description, Liked: liked});
    //   }
    // });
  }

  ionViewWillEnter() {
    this.getAlerts();
    this.routeService
      .getRouteDetail(this.routeId)
      .then(route => {
        this.route = route;
        //getHeart()
        this.prepareStops(route.Stops);
        this.vehicles = route.Vehicles;
        let modal = this.modalCtrl.create(StopModal, {stops: this.stops});
        //$ionicLoading.hide();
      });
  }
}