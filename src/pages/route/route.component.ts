import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { RouteService } from '../../services/route.service';
import { VehicleService } from '../../services/vehicle.service';
import { RouteDetail } from '../../models/route-detail.model';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'page-route',
  templateUrl: 'route.html'
})
export class RouteComponent {
  routeId: number;
  route: RouteDetail;
  vehicles: Vehicle[];
  constructor(public navCtrl: NavController, private navParams: NavParams,
    private routeService: RouteService, private vehicleService: VehicleService) {
    this.routeId = navParams.get('routeId');
  }

  getVehicles (): void {
    this.vehicleService
      .getRouteVehicles(this.routeId)
      .then(vehicles => this.vehicles = vehicles);
  }

  ionViewWillEnter() {
    this.routeService
      .getRouteDetail(this.routeId)
      .then(route => this.route = route);
  }
}
