import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { StopDeparture } from '../../models/stop-departure.model';
import { Stop } from '../../models/stop.model';
import { StopDepartureService } from '../../providers/stop-departure.service';
import { StopService } from '../../providers/stop.service';
import { RouteService } from '../../providers/route.service';
import { RouteComponent } from '../../pages/route/route.component';
import * as _ from 'lodash';
import * as moment from 'moment';

/**
 * Generated class for the StopDeparturesComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'stop-departures',
  templateUrl: 'stop-departures.html',
  inputs: ['stopId', 'sortBy', 'limit']
})
export class StopDepartures implements OnInit {
  stopId: any;
  limit: any;
  sortBy: string;
  directions: StopDeparture[];
  shownRoute: any = null;
  liked: boolean;
  departuresByDirection: Array<any> = [];
  routeList = [];
  loader;
  interval;
  // autoRefreshTime: number;
  title: string;
  order: String;
  stop: Stop;

  constructor(private stopDepartureSvc: StopDepartureService, private stopSvc: StopService,
  private routeSvc: RouteService, private loadingCtrl: LoadingController,
  public navCtrl: NavController, private navParams: NavParams) {
  }
  ngOnInit() {
    console.log(`stopid: ${this.stopId}`)
    this.stopId = parseInt(this.stopId, 10);
    console.log(this.limit);
    this.limit = this.limit ? parseInt(this.limit, 10) : undefined;
    this.getDepartures();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      switch (propName) {
        case 'stopId': this.stopId = parseInt(changes.stopId.currentValue, 10);
        case 'limit': this.limit = parseInt(this.limit, 10);
      }
    }
    this.getDepartures();
  }

  getDepartures(refresher?: any): void {
    // console.log('penispenispenis');
    // console.log(typeof this.stopId);
    this.stopDepartureSvc.getStopDeparture(this.stopId)
      .then(directions => {
        // console.log(directions);
        this.sort(directions[0]);
        this.getRoutes(_.uniq(_.map(directions[0].RouteDirections, 'RouteId')));
        this.hideLoader();
        if (refresher) refresher.complete();
    }).catch(err => {
      console.error(`Couldn't download departures, error: ${err}`);
      this.hideLoader();
      if (refresher) refresher.complete();
    });
  }
  // For a given RouteId, downloads the simplest
  // version of the details for that route from
  // Avail.  Adds it to a $scope-wide list.
  // Returns nothing.
  getRoute (id): any {
    this.routeSvc
      .getRoute(id)
      .then(route => {
        this.routeList[id] = (route);
      }).catch(err => {
        console.error(`Error downloading details for ${id}: ${err}`);
      });
  }
  // Calls getRoute() for each RouteId in
  // the input array.
  // Ex input: [20030, 30031, 20035]
  getRoutes (routes): any {
    for (let routeId of routes) {
      this.getRoute(routeId);
    }
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
    const sdt = moment(departure.SDT);
    const edt = moment(departure.EDT);
    return {
      // ex: '8:12 PM'
      sExact: moment(sdt).format('LT'),
      eExact: moment(edt).format('LT'),
      // ex: '6 minutes'
      sRelativeNoPrefix: moment(sdt).fromNow(true),
      eRelativeNoPrefix: moment(edt).fromNow(true)
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
          if (!moment(departure.EDT).isAfter(Date.now())) {
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

  presentLoader(): void {
      this.loader = this.loadingCtrl.create({
        content: 'Downloading departures...',
      });
      this.loader.present();
  }

  hideLoader(): void {
    if (this.loader) {
      this.loader.dismiss();
    }
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

}
