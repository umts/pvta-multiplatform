import { Component, ChangeDetectorRef } from '@angular/core';

import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StopDeparture } from '../../models/stop-departure.model';
import { Stop } from '../../models/stop.model';
import { StopDepartureService } from '../../providers/stop-departure.service';
import { StopService } from '../../providers/stop.service';
import { FavoriteStopService } from '../../providers/favorite-stop.service';
import { RouteComponent } from '../route/route.component';
import { StopMapComponent } from '../stop-map/stop-map.component';
import { RouteService } from '../../providers/route.service';
import { ToastService } from '../../providers/toast.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ConnectivityService } from '../../providers/connectivity.service';
import { AutoRefreshService } from '../../providers/auto-refresh.service';
import { DepartureSortService } from '../../providers/departure-sort.service';
import { InfoService } from '../../providers/info.service';
import { AlertService } from '../../providers/alert.service';
import { Alert } from '../../models/alert.model';

declare var ga;

@Component({
  selector: 'page-stop',
  templateUrl: 'stop.html'
})
export class StopComponent {
  directions: StopDeparture[];
  shownRoute: any = null;
  stopId: number;
  liked: boolean;
  departuresByDirection: Array<any> = [];
  routeList = [];
  loader;
  interval;
  // autoRefreshTime: number;
  title: string;
  order: String;
  stop: Stop;
  isInternetExplorer: boolean = false;
  alerts: Alert[];
  constructor(public navCtrl: NavController, navParams: NavParams,
    private stopDepartureSvc: StopDepartureService, infoSvc: InfoService,
    private routeSvc: RouteService, changer: ChangeDetectorRef,
    private loadingCtrl: LoadingController, private favoriteStopSvc: FavoriteStopService,
    private stopSvc: StopService, private connection: ConnectivityService,
    private storage: Storage, private refreshSvc: AutoRefreshService,
    private depSortSvc: DepartureSortService, private toastSvc: ToastService,
    private alertCtrl: AlertController, private alertService: AlertService) {
      this.stopId = parseInt(navParams.get('stopId'), 10);
      this.isInternetExplorer = infoSvc.isInternetExplorer();
      this.title = `Stop ${this.stopId}`;
      this.order = 'route';
      this.alerts = [];
      ga('set', 'page', '/stop.html');
      ga('send', 'pageview');
      document.addEventListener('pause', this.handleAppPause);
      document.addEventListener('resume', this.handleAppResume);
  }

  handleAppPause = () => {
    console.log('StopComponent: pause');
    clearInterval(this.interval);
  }
  handleAppResume = () => {
    console.log('StopComponent: resume');
    this.ionViewWillEnter();
  }

  presentLoader(): void {
      this.loader = this.loadingCtrl.create({
        content: 'Downloading departures...',
        enableBackdropDismiss: true
      });
      this.loader.present();
  }

  hideLoader(): void {
    if (this.loader) {
      this.loader.dismiss();
    }
  }

  pullToRefresh(refresher): void {
    this.getDepartures(refresher);
  }

  getDepartures(refresher?: any): void {
    this.stopDepartureSvc.getStopDeparture(this.stopId)
      .then(directions => {
        this.sort(directions[0]);
        let routeIds = _.uniq(_.map(directions[0].RouteDirections, 'RouteId'));
        let routePromises = this.routeSvc.getEachRoute(routeIds);
        for (let promise of routePromises) {
          promise.then(route => {
            if (route !== undefined)
              this.routeList[route.RouteId] = route;
          });
        }
        Promise.all(routePromises).then(routes => {
          this.departuresByDirection = _.sortBy(this.departuresByDirection, departure => {
            let route = this.routeList[departure.RouteId];
            if (route !== undefined)
              return parseInt(route.RouteAbbreviation.replace(/\D+/, ''), 10);
            else return 0;
          });
        });
        this.hideLoader();
        if (refresher) refresher.complete();
    }).catch(err => {
      console.error(`Couldn't download departures, error: ${err}`);
      this.hideLoader();
      if (refresher) refresher.complete();
    });
  }

  getAlerts(): void {
    this.alerts = [];
    this.alertService
    .getAlerts().then(alerts => {
      if (!alerts) {
        return;
      }
      for (let alert of alerts) {
        // display alerts that don't apply to any route
        if (alert.Routes.length === 0) {
          if (!_.includes(this.alerts, alert)) {
            this.alerts.push(alert);
          }
        } else {
          // display alerts that apply to routes that service the stop
          this.stopDepartureSvc.getStopDeparture(this.stopId)
            .then(directions => {
              for (let route of directions[0].RouteDirections) {
                if (_.includes(alert.Routes, route.RouteId)) {
                  if (!_.includes(this.alerts, alert)) {
                    this.alerts.push(alert);
                  }
                }
              }
            });
        }
      }
    });
  }

  ionViewWillEnter() {
    this.getAlerts();
    this.favoriteStopSvc.contains(this.stopId, (liked) => {
      this.liked = liked;
    });
    this.presentLoader();
    this.getDepartures();
    this.storage.ready().then(() => {
      this.storage.get('autoRefresh').then(autoRefresh => {
        let autoRefreshValidity: [boolean, number] = this.refreshSvc
        .verifyValidity(autoRefresh);
        // If the saved autorefresh value is NOT valid, make it valid.
        if (autoRefreshValidity[0] === false) {
          autoRefresh = autoRefreshValidity[1];
        }
        // If autorefresh is on, set an interval to refresh departures.
        if (this.refreshSvc.isAutoRefreshEnabled(autoRefresh)) {
            this.interval = setInterval(() => {
              console.log('Refreshing departures');
              this.getDepartures();
            }, autoRefresh);
        }
      }).catch(err => {
        console.error(`Error retrieving refresh time: ${err}`);
      });
      this.storage.get('departureSort').then(storedSort => {
        let departureSort: string = this.depSortSvc.validate(storedSort);
        this.order = departureSort;
      }).catch(err => {
        console.error(`Error retrieving departure sort: ${err}`);
      });
    }).catch(err => {
      console.error(`Error connecting to local storage: ${err}`);
    });
    this.stopSvc.getStop(this.stopId).then(stop => {
      this.stop = stop;
      this.title = `${this.stop.Description} (${this.stopId})`;
      ga('send', 'event', 'StopLoaded',
      'StopComponent.ionViewWillEnter', `Stop: ${stop.Description} (${this.stopId})`);
    }).catch(err => {
      console.error(`Error downloading stop details: ${err}`);
    });
  }

  ionViewWillLeave() {
    clearInterval(this.interval);
    document.removeEventListener('pause', this.handleAppPause);
    document.removeEventListener('resume', this.handleAppResume);
  }

  ionViewCanEnter(): boolean {
   return this.connection.getConnectionStatus();
  }
  toggleStopHeart(): void {
    // console.log('toggling', stop.Description);
    this.favoriteStopSvc.toggleFavorite(this.stopId, this.stop.Description);
    this.toastSvc.favoriteToast('Stop', this.liked);
  }

  /**
   * Given a Departure object,
   * calculates the human-readable departure times
   * that will be displayed in the UI.
   * Returns an object with 5 properties,
   * each a different way of displaying
   * either a scheduled time ('s') or an estimated time ('e').
   */
  calculateTimes (departure): Object {
    const sdt = moment(departure.SDT).startOf('minute');
    const edt = moment(departure.EDT).startOf('minute');
    return {
      // ex: '8:12 PM'
      sExact: moment(sdt).format('LT'),
      eExact: moment(edt).format('LT'),
      // ex: '6 minutes'
      sRelativeWithPrefix: moment(sdt).fromNow(),
      eRelativeWithPrefix: moment(edt).fromNow()
    };
  }
  /**
  * Given all the RouteDirections and their upcoming departures
  * at this stop, this function organizes and manipulates
  * all departures so they can be clearly and simply displayed in the UI.
  * It sorts departures in two ways:
  *   1) By Route Direction
  *   2) By Time
  */
  departuresByTime = [];
  sort (directions): any {
    this.departuresByTime = [];
    this.departuresByDirection = [];
    // Avail returns an array of RouteDirections. We must deal
    // with the Departures for each Direction.
    for (let direction of directions.RouteDirections) {
      if (direction.Departures && direction.Departures.length !== 0 && !direction.IsDone) {
        // Sorting Departures by Direction requires us to
        // maintain a tmp array of valid departures for a
        // given direction.
        var futureDepartures = [];
        // For each Departure for a given RouteDirection...
        for (let departure of direction.Departures) {

          // A departure is invalid if it was in the past
          const oneMinute = 60 * 1000;
          if (moment(departure.EDT).isBefore(Date.now() + oneMinute)) {
            continue;
          } else {
            /* Manipuate the departure object.
             * When sorting by Direction, we only need to
             * obtain the stringified departure times
             * and save the departure to futureDepartures.
             * When sorting by Time, pull out only the
             * necessary details from the Departures
             * and hold onto them.
             */
            // Departures by time: we can use a stripped down
            // version of the RouteDirection, because each
            // departure will be its own entry in the list.
            let lightweightDirection = {
              RouteId: direction.RouteId,
              Times: {},
              Departures: []
            };
            var times = this.calculateTimes(departure);
            departure.Times = times;
            lightweightDirection.Times = times;
            // Departures by time: marry this departure with its RouteId;
            // that's all it needs.
            lightweightDirection.Departures = departure;
            // Departures by RouteDirection: this is a valid departure,
            // so add it to the array.
            futureDepartures.push(departure);
            this.departuresByTime.push(lightweightDirection);
          }
        }
        /* Departures by RouteDirection: now that we
         * have all the valid departures for a given direction,
         * overwrite the RouteDirection's old departures array.
         */
        direction.Departures = futureDepartures;
        if (direction.Departures.length > 0) {
          this.departuresByDirection.push(direction);
        }
      }
    }
    // Departures by time: Sort the list of all
    // departures by Estimated Departure Time.
    this.departuresByTime = _.sortBy(this.departuresByTime, function (direction) {
      return direction.Departures.EDT;
    });
  }


    // **Sets** whether a route's
    // departures have been expanded on the page
    toggleRouteDropdown (routeDirection): void {
     if (this.isRouteDropdownShown(routeDirection)) {
       this.shownRoute = null;
     } else {
       this.shownRoute = routeDirection.RouteId + routeDirection.DirectionCode;
     }
   }

   // **Checks** whether a route's departures
 // have been expanded on the page
  isRouteDropdownShown (routeDirection): any  {
   return this.shownRoute === (routeDirection.RouteId + routeDirection.DirectionCode);
 }

 goToRoutePage(routeId: number): void {
   this.navCtrl.push(RouteComponent, {
     routeId: routeId
   }).catch(() => {
     console.error('Unable to go to route page');
   });
 }
 goToStopMapPage(): void {
   this.navCtrl.push(StopMapComponent, {
     stopId: this.stopId
   }).catch(() => {
     this.alertCtrl.create({
       title: 'No Connection',
       subTitle: 'The Stop Map page requires an Internet connection',
       buttons: ['Dismiss']
     }).present();
   });
 }
}
