import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { RouteService } from '../../providers/route.service';
import { StopService } from '../../providers/stop.service';
import { InfoService } from '../../providers/info.service';
import { FavoriteRouteService, FavoriteRouteModel } from '../../providers/favorite-route.service';
import { Route } from '../../models/route.model';
import { Stop } from '../../models/stop.model';
import { RouteComponent } from '../route/route.component';
import { StopComponent } from '../stop/stop.component';
import { FavoriteStopService, FavoriteStopModel } from '../../providers/favorite-stop.service';
import * as _ from 'lodash';
import * as haversine from 'haversine';

declare var ga;

@Component({
  selector: 'page-routes-and-stops',
  templateUrl: 'routes-and-stops.html'
})

export class RoutesAndStopsComponent {
  routes: Route[];
  stops: Stop[];
  favStops: FavoriteStopModel[];
  favRoutes: FavoriteRouteModel[];
  cDisplay: string;
  order: string;
  noLocation: boolean;
  previousPosition;
  searchQuery: string = '';
  stopsDisp: Stop[];
  routesDisp: Route[];
  stopsPromise: Promise<any>;
  routesPromise: Promise<any>;
  loader;
  isInternetExplorer: boolean = false;
  constructor(public navCtrl: NavController, private infoSvc: InfoService,
    private routeSvc: RouteService, private stopSvc: StopService,
    private loadingCtrl: LoadingController, private storage: Storage,
    private favRouteSvc: FavoriteRouteService, private alertCtrl: AlertController,
    private favStopSvc: FavoriteStopService, private geolocation: Geolocation) {
      this.isInternetExplorer = infoSvc.isInternetExplorer();
      this.order = 'favorites';
      this.cDisplay = 'routes';
      this.loader = loadingCtrl.create({
        content: 'Downloading...'
      });
      ga('set', 'page', '/routes-and-stops.html');
      ga('send', 'pageview');
    }
  onSearchQueryChanged(query: string): void {
    if (!query || query === '') {
      this.routesDisp = this.routes;
      this.stopsDisp = this.stops;
      this.searchQuery = '';
    } else {
      this.searchQuery = query;
      query = query.toLowerCase().trim();
      if (this.cDisplay === 'routes') {
        this.routesDisp = _.filter(this.routes, route => {
          return (route.LongName.toLowerCase().includes(query) ||
          route.RouteAbbreviation.toLowerCase().includes(query));
        });
      } else if (this.cDisplay = 'stops') {
        this.stopsDisp = _.filter(this.stops, stop => {
          return (stop.Description.toLowerCase().includes(query) ||
          stop.StopId.toString().includes(query));
        });
      }
    }
  }

  goToRoutePage(routeId: number): void {
    this.navCtrl.push(RouteComponent, {
      routeId: routeId
    }).catch(() => {
      this.alertCtrl.create({
        title: 'No Connection',
        subTitle: 'The Route page requires an Internet connection',
        buttons: ['Dismiss']
      }).present();
    });
  }

  goToStopPage(stopId: number): void {
    this.navCtrl.push(StopComponent, {
      stopId: stopId
    }).catch(() => {
      this.alertCtrl.create({
        title: 'No Connection',
        subTitle: 'The Stop page requires an Internet connection',
        buttons: ['Dismiss']
      }).present();
    });
  }

  prepareRoutes(): any {
    // For each route, add the custom 'Liked' property and keep only
    // the properties we care about.  Doing this makes searching easier.
    return _.map(this.routes, (route) => {
      route.Liked = _.includes(_.map(this.favRoutes, 'RouteId'), route.RouteId);
      return _.pick(route, 'RouteId', 'RouteAbbreviation', 'LongName', 'ShortName', 'Color', 'GoogleDescription', 'Liked');
    });
  }

  toggleRouteHeart(route: Route): void {
    this.favRouteSvc.toggleFavorite(route);
  }
  toggleStopHeart(stop: Stop): void {
    this.favStopSvc.toggleFavorite(stop.StopId, stop.Description);
  }

  getfavRoutes(): Promise<any> {
    return this.storage.ready().then(() => {
      return this.storage.get('favoriteRoutes').then((favRoutes: FavoriteRouteModel[]) => {
        return new Promise((resolve, reject) => {
          resolve(favRoutes);
        });
      });
    });
  }

  prepareStops(): any {
    // For each route, add the custom 'Liked' property and keep only
    // the properties we care about.  Doing this makes searching easier.
    return _.map(this.stops, (stop) => {
      stop.Liked = _.includes(_.map(this.favStops, 'StopId'), stop.StopId);
      return _.pick(stop, 'StopId', 'Name', 'Liked', 'Description', 'Latitude', 'Longitude', 'Distance');
    });
  }
  getfavStops(): Promise<any> {
    return this.storage.ready().then(() => {
      return this.storage.get('favoriteStops').then((favStops: Stop[]) => {
        return new Promise((resolve, reject) => {
          resolve(favStops);
        });
      });
    });
  }

  ionViewDidLoad() {
    this.routesPromise = this.routeSvc.getRouteList();
    this.routesPromise.then((routes: Route[]) => {
      this.routes = _.sortBy(routes, ['ShortName']);
      this.routesDisp = this.routes;
      this.routeSvc.saveRouteList(this.routes);
    }).catch(err => {
      console.error(err);
    });

    this.stopsPromise = this.stopSvc.getStopList();
    this.stopsPromise.then((stops: Stop[]) => {
      this.stops = _.uniqBy(stops, 'StopId');
      this.stopsDisp = this.stops;
      this.stopSvc.saveStopList(this.stops);

      let options = {timeout: 5000, enableHighAccuracy: true};
      this.geolocation.getCurrentPosition(options).then(position => {
        this.calculateStopDistances(position);
      }).catch(err => {
        this.calculateStopDistances();
      });
    }).catch(err => {
      console.error(err);
    });
  }

  ionViewWillEnter() {
    this.onSearchQueryChanged(this.searchQuery);
    let fs: Promise<any> = this.getfavStops();
    let fr: Promise<any> = this.getfavRoutes();
    Promise.all([this.routesPromise, fr]).then((value) => {
      console.log('Ready with routes and fav routes');
      this.favRoutes = value[1];
      this.routes = this.prepareRoutes();
    }).catch(err => {
      console.log('weenies');
      console.log(err);
    });
    Promise.all([this.stopsPromise, fs]).then((value) => {
      console.log('Ready with stops and fav stops');
      this.favStops = value[1];
      this.stops = this.prepareStops();
    }).catch(err => {
      console.log('weenies');
      console.log(err);
    });
    Promise.all([this.routesPromise, fr, this.stopsPromise, fs]).then(() => {
      this.toggleOrdering();
    }).catch(err => {
      console.log('weenies');
      console.log(err);
    });
  }
  /*
   * Switches between the ways Routes and Stops can be ordered.
   * Takes no params because the <select> is bound to a model - $scope.order.
   */
  toggleOrdering(): void {
    this.onSearchQueryChanged(this.searchQuery);
    var routeOrderings = ['favorites', 'name'];
    var stopOrderings = ['favorites', 'distance'];
    let primarySort: string;
    let primarySortType: string;
    let secondarySort: string;
    let secondarySortType: string;
    // If routes are currently in view
    if (this.cDisplay === 'routes') {
      if (!_.includes(routeOrderings, this.order)) {
        this.order = routeOrderings[0];
      }
      // Based on the user's requested ordering, we need to
      // set the dimensions that orderBy  will use in the view.
      switch (this.order) {
        case 'name':
          primarySort = 'RouteAbbreviation';
          primarySortType = 'asc';
          break;
        case 'favorites':
          primarySort = 'Liked';
          primarySortType = 'desc';
          break;
        default:
          primarySort = 'Liked';
          primarySortType = 'desc';
      }
      secondarySort = 'RouteAbbreviation';
      secondarySortType = 'asc';
      this.routesDisp = _.orderBy(this.routesDisp,
        [primarySort, secondarySort], [primarySortType, secondarySortType]);
    } else if (this.cDisplay === 'stops') {
      // If stops are currently in view
      if (!_.includes(stopOrderings, this.order)) {
        this.order = stopOrderings[0];
      }
      switch (this.order) {
        case 'favorites':
          primarySort = 'Liked';
          primarySortType = 'desc';
          break;
        case 'distance':
          primarySort = 'Distance';
          primarySortType = 'asc';
          break;
        default:
          primarySort = 'Liked';
          primarySortType = 'desc';
      }
      // If we have location, we can secondarily sort by distance. Otherwise, by name.
      if (this.noLocation) {
        secondarySort = 'Description';
        secondarySortType = 'asc';
      } else {
        secondarySort = 'Distance';
        secondarySortType = 'asc';
      }
      this.stopsDisp = _.orderBy(this.stopsDisp,
        [primarySort, secondarySort], [primarySortType, secondarySortType]);
    }
  }
  /*
  * Calculates the distance between the user and every PVTA stop.
  * @param position: Object - the current location
  */
  calculateStopDistances(position?): void {
    if (position) {
      var currentPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      // If this is the first time we've gotten the user's position OR
      // we already gotten a position but they've since moved more than
      // 100m (.1km) from it, we calculate their distance from every stop.
      // We use the haversine formula here because it's more accurate
      // the standard Distance Formula.
      if (!this.previousPosition || (this.previousPosition !== undefined && (haversine(this.previousPosition, currentPosition) > .1))) {
        var msg = 'Current position found, but no previous position or has moved; calculating stop distances.';
        ga('send', 'event', 'CalculatingStopDistances',
          'RoutesAndStopsComponent.calculateStopDistances()', msg);
        console.log(msg);

        for (let stop of this.stops) {
          // Use the well-known Distance Formula, aka
          // the "square root of the sum of squares"
          // to calculate distance to each stop.
          // 2x faster than haversine (less accurate), so
          // we take the speed, since we're doing it ~2000 times.
          var lats = Math.pow(stop.Latitude - position.coords.latitude, 2);
          var lons = Math.pow(stop.Longitude - position.coords.longitude, 2);
          // Distance is a float, representing degrees from our current location
          var newDistance = Math.sqrt(lats + lons);
          stop.Distance = newDistance;
        }
      }
      // Regardless of whether we need to recalculate stop distances,
      // we still have the user's location.
      this.noLocation = false;
      // stopOrder = 'distance';
      this.previousPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } else if (!position) {
      // If we don't have their location, tell them!
      this.noLocation = true;
      // stopOrder = 'favorites';
    }
    // Finally, regardless of whether we have their location,
    // we want to save the stop list.
    this.stopSvc.saveStopList(this.stops);
  }
}
