import { Component, OnInit } from '@angular/core';

import { NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Http, Response } from '@angular/http';

import { RouteService } from '../../services/route.service';
import { StopService } from '../../services/stop.service';
import { FavoriteRouteService, FavoriteRouteModel } from '../../services/favorite-route.service';
import { Route } from '../../models/route.model';
import { Stop } from '../../models/stop.model';
import { RouteComponent } from '../route/route.component';
import { StopComponent } from '../stop/stop.component'
import { FavoriteStopService, FavoriteStopModel } from '../../services/favorite-stop.service';
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
  favoriteStops: FavoriteStopModel[];
  favoriteRoutes: FavoriteRouteModel[];
  // currentDisplay: string = '0';
  segment = SegmentDisplay;
  cDisplay: SegmentDisplay;
  searchQuery: string = '';
  stopsDisp: Stop[];
  routesDisp: Route[];
  loader;
  constructor(public navCtrl: NavController,
    private routeService: RouteService, private stopService: StopService,
    private loadingCtrl: LoadingController, private storage: Storage,
    private favoriteRouteService: FavoriteRouteService,
    private favoriteStopService: FavoriteStopService) {
      this.cDisplay = SegmentDisplay.Routes;
      this.loader = loadingCtrl.create({
          content: 'Downloading departures...'
        });
    }

  onSearchQueryChanged(event: any): void {
    let query: string = event.target.value;
    if (!query || query == '') {
      this.routesDisp = this.routes;
      this.stopsDisp = this.stops;
    }
    else {
      query = query.toLowerCase().trim();
      if (this.cDisplay == SegmentDisplay.Routes) {
        this.routesDisp = _.filter(this.routes, route => {
          return (route.LongName.toLowerCase().includes(query) ||
          route.RouteAbbreviation.toLowerCase().includes(query));
        });
      }
      else if (this.cDisplay = SegmentDisplay.Stops){
        this.stopsDisp = _.filter(this.stops, stop => {
          return (stop.Description.toLowerCase().includes(query) ||
          stop.StopId.toString().includes(query));
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

  prepareRoutes(): any {
    // For each route, add the custom 'Liked' property and keep only
    // the properties we care about.  Doing this makes searching easier.
    return _.map(this.routes, (route) => {
      route.Liked = _.includes(_.map(this.favoriteRoutes, 'RouteId'), route.RouteId);
      return _.pick(route, 'RouteId', 'RouteAbbreviation', 'LongName', 'ShortName', 'Color', 'GoogleDescription', 'Liked');
    });
  }

  toggleRouteHeart(route: Route): void {
    // console.log('toggling the', route.RouteAbbreviation);
    this.favoriteRouteService.toggleFavorite(route);
  }
  toggleStopHeart(stop: Stop): void {
    // console.log('toggling', stop.Description);
    this.favoriteStopService.toggleFavorite(stop);
  }

  getFavoriteRoutes(): void {
    this.storage.ready().then(() => {
      this.storage.get('favoriteRoutes').then((favoriteRoutes: FavoriteRouteModel[]) => {
        // console.log('favs', favoriteRoutes);
        this.favoriteRoutes = favoriteRoutes;
        this.routes = this.prepareRoutes();
      })
    })
  }

  prepareStops(): any {
    // For each route, add the custom 'Liked' property and keep only
    // the properties we care about.  Doing this makes searching easier.
    return _.map(this.stops, (stop) => {
      stop.Liked = _.includes(_.map(this.favoriteStops, 'StopId'), stop.StopId);
      return _.pick(stop, 'StopId', 'Name', 'Liked', 'Description', 'Latitude', 'Longitude', 'Distance');
    });
  }
  getFavoriteStops(): void {
    this.storage.ready().then(() => {
      this.storage.get('favoriteStops').then((favoriteStops: Stop[]) => {
        this.favoriteStops = favoriteStops;
        this.stops = this.prepareStops();
      })
    })
  }

  ionViewWillEnter() {
    this.loader.present();
    this.routeService.getRouteList((routesPromise: Promise<Route[]>) => {
      routesPromise.then(routes => {

        this.routes = _.sortBy(routes, ['ShortName']);
        this.routesDisp = this.routes;
        this.routeService.saveRouteList(this.routes);
        this.getFavoriteRoutes();
      });
    });
    this.stopService.getStopList((stopsPromise: Promise<Stop[]>) => {
      stopsPromise.then(stops => {

        this.stops = _.uniqBy(stops, 'StopId');
        this.stopsDisp = this.stops;
        this.stopService.saveStopList(this.stops);
        this.getFavoriteStops();
        this.loader.dismiss();
      });
    });
  }
}
