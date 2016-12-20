import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { RouteService } from '../../services/route.service';
import { RouteDetail } from '../../models/route-detail.model';

@Component({
  selector: 'page-route',
  templateUrl: 'route.html'
})
export class RouteComponent {
  routeId: number;
  route: RouteDetail;
  constructor(public navCtrl: NavController, private navParams: NavParams,
    private routeService: RouteService) {
    this.routeId = navParams.get('routeId');
  }
  ionViewWillEnter() {
    this.routeService
      .getRouteDetail(this.routeId)
      .then(route => this.route = route as RouteDetail);
  }
}
