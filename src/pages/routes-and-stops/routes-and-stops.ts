import { Component, OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Http, Response } from '@angular/http';

import { RouteService } from '../../services/route.service';
import { StopService } from '../../services/stop.service';
import { Route } from '../../models/route';
import { Stop } from '../../models/stop';



@Component({
  selector: 'page-routes-and-stops',
  templateUrl: 'routes-and-stops.html'
})
export class RoutesAndStops implements OnInit {
  routes: Route[];
  stops: Stop[];
  constructor(public navCtrl: NavController,
    private routeService: RouteService, private stopService: StopService) { }

  ngOnInit(): void {
    console.log('kjdflkdsjf');
      this.routeService
      .getAllRoutes()
      .then(routes => this.routes = routes);
      this.stopService
      .getAllStops()
      .then(stops => this.stops = stops);
    }
  }
