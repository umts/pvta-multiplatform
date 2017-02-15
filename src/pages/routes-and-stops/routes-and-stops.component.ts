import { Component, OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Http, Response } from '@angular/http';

import { RouteService } from '../../services/route.service';
import { StopService } from '../../services/stop.service';
import { Route } from '../../models/route.model';
import { Stop } from '../../models/stop.model';
import { RouteComponent } from '../route/route.component';
import { StopComponent } from '../stop/stop.component'
import * as _ from 'lodash';

export enum SegmentDisplay {
    Routes,
    Stops,
}

@Component({
  selector: 'page-routes-and-stops',
  templateUrl: 'routes-and-stops.html'
})

export class RoutesAndStopsComponent {
  routes: Route[];
  stops: Stop[];
  // currentDisplay: string = '0';
  segment = SegmentDisplay;
  cDisplay: SegmentDisplay;
  searchQuery: string = '';
  stopsDisp: Stop[];
  routesDisp: Route[];
  constructor(public navCtrl: NavController,
    private routeService: RouteService, private stopService: StopService) {
      this.cDisplay = SegmentDisplay.Routes;
    }

  onSearchQueryChanged(event: any): void {
    let query: string = event.target.value.toLowerCase().trim();
    console.log(query);
    if (query == '') {
      this.routesDisp = this.routes;
      this.stopsDisp = this.stops;
    }
    else {
      if (this.cDisplay == SegmentDisplay.Routes) {
        // this.routesDisp = this.routes;
        this.routesDisp = _.filter(this.routes, route => {
          // console.log(route.LongName, " ", route.RouteAbbreviation);
          return (route.LongName.toLowerCase().includes(query) || route.RouteAbbreviation.toLowerCase().includes(query));
        });
        // console.log(this.routesDisp);
      }
      else if (this.cDisplay = SegmentDisplay.Stops){
        // console.log(query, "qeen");
        // this.stopsDisp = this.stops;
        this.stopsDisp = _.filter(this.stops, stop => {
          // console.log(stop.Description, query, stop.Description.toLowerCase().includes(query));
          return stop.Description.toLowerCase().includes(query);
        });
      }
    }
  }

  redirectRoute(routeId: number): void {
    this.navCtrl.push(RouteComponent, {
      routeId: routeId
    });
  }

  redirectStop(stopId: number): void {
    this.navCtrl.push(StopComponent, {
      stopId: stopId
    });
  }

  ionViewWillEnter() {
    this.routeService
      .getAllRoutes()
      .then(routes => {
        this.routes = routes;
        this.routesDisp = routes;
      });
    this.stopService
      .getAllStops()
      .then(stops => {
        this.stops = stops;
        this.stopsDisp = stops;
      });
    }
  }
