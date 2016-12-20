import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { RouteService } from '../../services/route.service';
import { VehicleService } from '../../services/vehicle.service';
import { AlertService } from '../../services/alert.service';
import { RouteDetail } from '../../models/route-detail.model';
import { Vehicle } from '../../models/vehicle.model';
import { Alert } from '../../models/alert.model';
import * as _ from 'lodash';

@Component({
  selector: 'page-route',
  templateUrl: 'route.html'
})
export class RouteComponent {
  routeId: number;
  route: RouteDetail;
  vehicles: Vehicle[];
  alerts: Alert[] = [];
  constructor(public navCtrl: NavController, private navParams: NavParams,
    private routeService: RouteService, private vehicleService: VehicleService,
    private alertService: AlertService) {
    this.routeId = navParams.get('routeId');
  }

  getVehicles (): void {
    this.vehicleService
      .getRouteVehicles(this.routeId)
      .then(vehicles => this.vehicles = vehicles);
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
        //this.vehicles = vehicles;
        if (alert.Routes.includes(this.routeId)) {
          this.alerts.push(alert);
        }
      }
      console.log(JSON.stringify(this.alerts));
    });
  }

  ionViewWillEnter() {
    _.times(3, index => console.log(index));
    this.getAlerts();
    this.routeService
      .getRouteDetail(this.routeId)
      .then(route => this.route = route);
  }
}
