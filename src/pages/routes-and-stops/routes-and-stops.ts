import { Component, OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Http, Response } from '@angular/http';

import { RouteService } from '../../services/route.service';
import { Route } from '../../models/route';



@Component({
  selector: 'page-routes-and-stops',
  templateUrl: 'routes-and-stops.html'
})
export class RoutesAndStops implements OnInit {
  routes: Route[];
  constructor(public navCtrl: NavController,
    private routeService: RouteService) { }

  //private routesUrl = 'http://bustracker.pvta.com/infopoint/rest/routes/getvisibleroutes';  // URL to web API
  ngOnInit(): void {
    console.log('kjdflkdsjf');
      this.routeService
      .getRoutes()
      .then(routes => this.routes = routes);
    }
  // poo() {
  //   this.http.get('http://bustracker.pvta.com/infopoint/rest/routes/get/20030')
  //     .subscribe(
  //       data => {
  //         let x: StopDeparture = data.json() as StopDeparture;
  //         console.log(x)
  //       },
  //       err => console.log(err),
  //       () => console.log('Random Quote Complete')
  //     );
  //   }
}
