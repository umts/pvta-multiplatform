import { Component, ChangeDetectorRef } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { StopDeparture } from '../../models/stop-departure.model';
import { StopDepartureService } from '../../services/stop-departure.service';
import { RouteComponent } from '../route/route.component';
import { RouteService } from '../../services/route.service';
import { Route } from '../../models/route.model';
import * as _ from 'lodash';

@Component({
  selector: 'page-stop',
  templateUrl: 'stop.html'
})
export class StopComponent {
  directions: StopDeparture[];
  shownRoute: any = null;
  stopId: number;
  //routeList: Map<any, any>;
  routeList: Object = {};
  constructor(public navCtrl: NavController, private navParams: NavParams,
    private stopDepartureService: StopDepartureService,
    private routeService: RouteService, private changer: ChangeDetectorRef) {
      this.stopId = navParams.get('stopId');
      // this.routeList = new Map();
      // this.routeList.set('20031', 'sasn');
    }
    ionViewWillEnter() {
      this.stopDepartureService
        .getStopDeparture(this.stopId)
        .then(directions => {
          this.sort(directions[0]);
          this.getRoutes(_.uniq(_.map(directions[0].RouteDirections, 'RouteId')));
          console.log(JSON.stringify(this.routeListDummy));
          console.log(JSON.stringify(this.routeList));
        });
    }

  // For a given RouteId, downloads the simplest
  // version of the details for that route from
  // Avail.  Adds it to a $scope-wide list.
  // Returns nothing.
  getRoute (id): any {
    this.routeService
      .getRoute(id)
      .then(route => {
        // console.log(route.RouteId);
        let strId: string = String(route.RouteId);
        Object.defineProperty(this.routeList, strId,
          {
            value: route,
            writable: true,
            enumerable: true
          })
        // this.routeList.set(route.RouteId, route);
        // console.log(this.routeList.get('20031'));
      });
  }
  // Calls getRoute() for each RouteId in
  // the input array.
  // Ex input: [20030, 30031, 20035]
  getRoutes (routes): any {
    for (let routeId of routes) {
      this.getRoute(routeId);
    }
    this.changer.detectChanges();
    console.log(JSON.stringify(this.routeList));
    //$ionicLoading.hide();
  };
  /**
  * Given all the RouteDirections and their upcoming departures
  * at this stop, this function organizes and manipulates
  * all departures so they can be clearly and simply displayed in the UI.
  * It sorts departures in two ways:
  *   1) By Route Direction
  *   2) By Time
  */
  departuresByDirection = [];
  departuresByTime = [];
  sort (directions): any {
    //console.log(JSON.stringify(directions));
    this.departuresByDirection = [];
    this.departuresByTime = [];
    // Avail returns an array of RouteDirections. We must deal
    // with the Departures for each Direction.
    for (let direction of directions.RouteDirections) {
      if (direction.Departures && direction.Departures.length != 0 && !direction.IsDone) {
      //  console.log(JSON.stringify(direction)+"\n");
        // Sorting Departures by Direction requires us to
        // maintain a tmp array of valid departures for a
        // given direction.
        var futureDepartures = [];
        // For each Departure for a given RouteDirection...
        for (let departure of direction.Departures) {

          // A departure is invalid if it was in the past

          // @TODO REMOVE WHEN MOMENT HAS BEEN ADDED
          if (false) {
            // Never enter this, yo.
          }
          // @TODO UNCOMMENT WHEN MOMENT HAS BEEN ADDED
          // if (!moment(departure.EDT).isAfter(Date.now())) {
          //   return;
          // }
          /* Manipuate the departure object.
           * When sorting by Direction, we only need to
           * obtain the stringified departure times
           * and save the departure to futureDepartures.
           * When sorting by Time, pull out only the
           * necessary details from the Departures
           * and hold onto them.
           */
          else {
            // Departures by time: we can use a stripped down
            // version of the RouteDirection, because each
            // departure will be its own entry in the list.
            var lightweightDirection = {
              RouteId: direction.RouteId,
              Times: {},
              Departures: []
            };
            // @TODO UNCOMMENT WHEN MOMENT IS ADDED
            var times = { };
            //var times = calculateTimes(departure);
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
//    console.log(this.departuresByDirection);
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
   };

   // **Checks** whether a route's departures
 // have been expanded on the page
  isRouteDropdownShown (routeDirection): any  {
   return this.shownRoute === (routeDirection.RouteId + routeDirection.DirectionCode);
 };

 goToRoutePage(routeId: number): void {
   this.navCtrl.push(RouteComponent, {
     routeId: routeId
   });
 }


    departuresByDirectionDummy = [ { RouteId: 20030,
    RouteRecordId: 2,
    Direction: 'Northbound',
    DirectionCode: 'N',
    IsHeadway: false,
    IsDone: false,
    Departures:
     [ { EDT: '/Date(1486436694000-0500)/',
         SDT: '/Date(1486436490000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486436694000-0500)/',
         STA: '/Date(1486436490000-0500)/',
         Dev: '00:03:24',
         Trip:
          { TripId: 2145,
            RunId: 302,
            BlockFareboxId: 302,
            TripRecordId: 480,
            RunRecordId: 0,
            BlockRecordId: 57,
            ServiceLevelRecordId: 79,
            StopSequence: 990,
            PatternRecordId: 1846,
            TripStartTime: '/Date(1136169900000-0500)/',
            InternalSignDesc: '30 North Amherst',
            InternetServiceDesc: 'North Amherst',
            IVRServiceDesc: 'North Amherst',
            TripDirection: 'N' },
         LastUpdated: '/Date(1486435175393-0500)/',
         Bay: null,
         Times:
          { sExact: '10:01 PM',
            eExact: '10:04 PM',
            sRelative: 'in 21 minutes',
            eRelative: 'in 25 minutes',
            eRelativeNoPrefix: '25 minutes' } },
       { EDT: '/Date(1486438374000-0500)/',
         SDT: '/Date(1486438290000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486438374000-0500)/',
         STA: '/Date(1486438290000-0500)/',
         Dev: '00:01:24',
         Trip:
          { TripId: 2215,
            RunId: 305,
            BlockFareboxId: 305,
            TripRecordId: 251,
            RunRecordId: 0,
            BlockRecordId: 61,
            ServiceLevelRecordId: 79,
            StopSequence: 990,
            PatternRecordId: 1846,
            TripStartTime: '/Date(1136171700000-0500)/',
            InternalSignDesc: '30 North Amherst',
            InternetServiceDesc: 'North Amherst',
            IVRServiceDesc: 'North Amherst',
            TripDirection: 'N' },
         LastUpdated: '/Date(1486434928660-0500)/',
         Bay: null,
         Times:
          { sExact: '10:31 PM',
            eExact: '10:32 PM',
            sRelative: 'in an hour',
            eRelative: 'in an hour',
            eRelativeNoPrefix: 'an hour' } },
       { EDT: '/Date(1486440294000-0500)/',
         SDT: '/Date(1486440090000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486440294000-0500)/',
         STA: '/Date(1486440090000-0500)/',
         Dev: '00:03:24',
         Trip:
          { TripId: 2245,
            RunId: 302,
            BlockFareboxId: 302,
            TripRecordId: 165,
            RunRecordId: 0,
            BlockRecordId: 57,
            ServiceLevelRecordId: 79,
            StopSequence: 990,
            PatternRecordId: 1846,
            TripStartTime: '/Date(1136173500000-0500)/',
            InternalSignDesc: '30 North Amherst',
            InternetServiceDesc: 'North Amherst',
            IVRServiceDesc: 'North Amherst',
            TripDirection: 'N' },
         LastUpdated: '/Date(1486435175423-0500)/',
         Bay: null,
         Times:
          { sExact: '11:01 PM',
            eExact: '11:04 PM',
            sRelative: 'in an hour',
            eRelative: 'in an hour',
            eRelativeNoPrefix: 'an hour' } },
       { EDT: '/Date(1486441974000-0500)/',
         SDT: '/Date(1486441890000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486441974000-0500)/',
         STA: '/Date(1486441890000-0500)/',
         Dev: '00:01:24',
         Trip:
          { TripId: 2315,
            RunId: 305,
            BlockFareboxId: 305,
            TripRecordId: 250,
            RunRecordId: 0,
            BlockRecordId: 61,
            ServiceLevelRecordId: 79,
            StopSequence: 990,
            PatternRecordId: 1846,
            TripStartTime: '/Date(1136175300000-0500)/',
            InternalSignDesc: '30 North Amherst',
            InternetServiceDesc: 'North Amherst',
            IVRServiceDesc: 'North Amherst',
            TripDirection: 'N' },
         LastUpdated: '/Date(1486434928690-0500)/',
         Bay: null,
         Times:
          { sExact: '11:31 PM',
            eExact: '11:32 PM',
            sRelative: 'in 2 hours',
            eRelative: 'in 2 hours',
            eRelativeNoPrefix: '2 hours' } },
       { EDT: '/Date(1486443894000-0500)/',
         SDT: '/Date(1486443690000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486443894000-0500)/',
         STA: '/Date(1486443690000-0500)/',
         Dev: '00:03:24',
         Trip:
          { TripId: 2345,
            RunId: 302,
            BlockFareboxId: 302,
            TripRecordId: 483,
            RunRecordId: 0,
            BlockRecordId: 57,
            ServiceLevelRecordId: 79,
            StopSequence: 990,
            PatternRecordId: 1846,
            TripStartTime: '/Date(1136177100000-0500)/',
            InternalSignDesc: '30 North Amherst',
            InternetServiceDesc: 'North Amherst',
            IVRServiceDesc: 'North Amherst',
            TripDirection: 'N' },
         LastUpdated: '/Date(1486435175453-0500)/',
         Bay: null,
         Times:
          { sExact: '12:01 AM',
            eExact: '12:04 AM',
            sRelative: 'in 2 hours',
            eRelative: 'in 2 hours',
            eRelativeNoPrefix: '2 hours' } } ],
    HeadwayDepartures: null },
  { RouteId: 20031,
    RouteRecordId: 3,
    Direction: 'Northbound',
    DirectionCode: 'N',
    IsHeadway: false,
    IsDone: false,
    Departures:
     [ { EDT: '/Date(1486435665000-0500)/',
         SDT: '/Date(1486435611000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486435665000-0500)/',
         STA: '/Date(1486435611000-0500)/',
         Dev: '00:00:54',
         Trip:
          { TripId: 2133,
            RunId: 315,
            BlockFareboxId: 315,
            TripRecordId: 214,
            RunRecordId: 0,
            BlockRecordId: 64,
            ServiceLevelRecordId: 79,
            StopSequence: 831,
            PatternRecordId: 1988,
            TripStartTime: '/Date(1136169180000-0500)/',
            InternalSignDesc: '31 Sunderland',
            InternetServiceDesc: 'Sunderland',
            IVRServiceDesc: 'Sunderland',
            TripDirection: 'N' },
         LastUpdated: '/Date(1486435120387-0500)/',
         Bay: null,
         Times:
          { sExact: '9:46 PM',
            eExact: '9:47 PM',
            sRelative: 'in 7 minutes',
            eRelative: 'in 8 minutes',
            eRelativeNoPrefix: '8 minutes' } },
       { EDT: '/Date(1486437785000-0500)/',
         SDT: '/Date(1486437711000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486437785000-0500)/',
         STA: '/Date(1486437711000-0500)/',
         Dev: '00:01:14',
         Trip:
          { TripId: 2208,
            RunId: 313,
            BlockFareboxId: 313,
            TripRecordId: 1893,
            RunRecordId: 0,
            BlockRecordId: 40,
            ServiceLevelRecordId: 79,
            StopSequence: 831,
            PatternRecordId: 1988,
            TripStartTime: '/Date(1136171280000-0500)/',
            InternalSignDesc: '31 Sunderland',
            InternetServiceDesc: 'Sunderland',
            IVRServiceDesc: 'Sunderland',
            TripDirection: 'N' },
         LastUpdated: '/Date(1486435164327-0500)/',
         Bay: null,
         Times:
          { sExact: '10:21 PM',
            eExact: '10:23 PM',
            sRelative: 'in 42 minutes',
            eRelative: 'in 43 minutes',
            eRelativeNoPrefix: '43 minutes' } },
       { EDT: '/Date(1486439865000-0500)/',
         SDT: '/Date(1486439811000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486439865000-0500)/',
         STA: '/Date(1486439811000-0500)/',
         Dev: '00:00:54',
         Trip:
          { TripId: 2243,
            RunId: 315,
            BlockFareboxId: 315,
            TripRecordId: 2191,
            RunRecordId: 0,
            BlockRecordId: 64,
            ServiceLevelRecordId: 79,
            StopSequence: 831,
            PatternRecordId: 1988,
            TripStartTime: '/Date(1136173380000-0500)/',
            InternalSignDesc: '31 Sunderland',
            InternetServiceDesc: 'Sunderland',
            IVRServiceDesc: 'Sunderland',
            TripDirection: 'N' },
         LastUpdated: '/Date(1486435120430-0500)/',
         Bay: null,
         Times:
          { sExact: '10:56 PM',
            eExact: '10:57 PM',
            sRelative: 'in an hour',
            eRelative: 'in an hour',
            eRelativeNoPrefix: 'an hour' } },
       { EDT: '/Date(1486441985000-0500)/',
         SDT: '/Date(1486441911000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486441985000-0500)/',
         STA: '/Date(1486441911000-0500)/',
         Dev: '00:01:14',
         Trip:
          { TripId: 2318,
            RunId: 313,
            BlockFareboxId: 313,
            TripRecordId: 1899,
            RunRecordId: 0,
            BlockRecordId: 40,
            ServiceLevelRecordId: 79,
            StopSequence: 831,
            PatternRecordId: 1988,
            TripStartTime: '/Date(1136175480000-0500)/',
            InternalSignDesc: '31 Sunderland',
            InternetServiceDesc: 'Sunderland',
            IVRServiceDesc: 'Sunderland',
            TripDirection: 'N' },
         LastUpdated: '/Date(1486435164383-0500)/',
         Bay: null,
         Times:
          { sExact: '11:31 PM',
            eExact: '11:33 PM',
            sRelative: 'in 2 hours',
            eRelative: 'in 2 hours',
            eRelativeNoPrefix: '2 hours' } },
       { EDT: '/Date(1486444065000-0500)/',
         SDT: '/Date(1486444011000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486444065000-0500)/',
         STA: '/Date(1486444011000-0500)/',
         Dev: '00:00:54',
         Trip:
          { TripId: 2353,
            RunId: 315,
            BlockFareboxId: 315,
            TripRecordId: 2597,
            RunRecordId: 0,
            BlockRecordId: 64,
            ServiceLevelRecordId: 79,
            StopSequence: 831,
            PatternRecordId: 1988,
            TripStartTime: '/Date(1136177580000-0500)/',
            InternalSignDesc: '31 Sunderland',
            InternetServiceDesc: 'Sunderland',
            IVRServiceDesc: 'Sunderland',
            TripDirection: 'N' },
         LastUpdated: '/Date(1486435120467-0500)/',
         Bay: null,
         Times:
          { sExact: '12:06 AM',
            eExact: '12:07 AM',
            sRelative: 'in 2 hours',
            eRelative: 'in 2 hours',
            eRelativeNoPrefix: '2 hours' } } ],
    HeadwayDepartures: null },
  { RouteId: 20034,
    RouteRecordId: 5,
    Direction: 'Down',
    DirectionCode: 'DOW',
    IsHeadway: false,
    IsDone: false,
    Departures:
     [ { EDT: '/Date(1486435829000-0500)/',
         SDT: '/Date(1486435808000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486435829000-0500)/',
         STA: '/Date(1486435808000-0500)/',
         Dev: '00:00:21',
         Trip:
          { TripId: 2144,
            RunId: 342,
            BlockFareboxId: 342,
            TripRecordId: 2035,
            RunRecordId: 0,
            BlockRecordId: 58,
            ServiceLevelRecordId: 79,
            StopSequence: 368,
            PatternRecordId: 1922,
            TripStartTime: '/Date(1136169840000-0500)/',
            InternalSignDesc: '34 Mullins Ctr',
            InternetServiceDesc: 'Mullins Center via CompSci',
            IVRServiceDesc: 'Mullins Center via CompSci',
            TripDirection: 'DOW' },
         LastUpdated: '/Date(1486435149253-0500)/',
         Bay: null,
         Times:
          { sExact: '9:50 PM',
            eExact: '9:50 PM',
            sRelative: 'in 10 minutes',
            eRelative: 'in 10 minutes',
            eRelativeNoPrefix: '10 minutes' } },
       { EDT: '/Date(1486438229000-0500)/',
         SDT: '/Date(1486438208000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486438229000-0500)/',
         STA: '/Date(1486438208000-0500)/',
         Dev: '00:00:21',
         Trip:
          { TripId: 2224,
            RunId: 342,
            BlockFareboxId: 342,
            TripRecordId: 2034,
            RunRecordId: 0,
            BlockRecordId: 58,
            ServiceLevelRecordId: 79,
            StopSequence: 368,
            PatternRecordId: 1922,
            TripStartTime: '/Date(1136172240000-0500)/',
            InternalSignDesc: '34 Mullins Ctr',
            InternetServiceDesc: 'Mullins Center via CompSci',
            IVRServiceDesc: 'Mullins Center via CompSci',
            TripDirection: 'DOW' },
         LastUpdated: '/Date(1486435149280-0500)/',
         Bay: null,
         Times:
          { sExact: '10:30 PM',
            eExact: '10:30 PM',
            sRelative: 'in an hour',
            eRelative: 'in an hour',
            eRelativeNoPrefix: 'an hour' } },
       { EDT: '/Date(1486440629000-0500)/',
         SDT: '/Date(1486440608000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486440629000-0500)/',
         STA: '/Date(1486440608000-0500)/',
         Dev: '00:00:21',
         Trip:
          { TripId: 2304,
            RunId: 342,
            BlockFareboxId: 342,
            TripRecordId: 2015,
            RunRecordId: 0,
            BlockRecordId: 58,
            ServiceLevelRecordId: 79,
            StopSequence: 368,
            PatternRecordId: 1922,
            TripStartTime: '/Date(1136174640000-0500)/',
            InternalSignDesc: '34 Mullins Ctr',
            InternetServiceDesc: 'Mullins Center via CompSci',
            IVRServiceDesc: 'Mullins Center via CompSci',
            TripDirection: 'DOW' },
         LastUpdated: '/Date(1486435149307-0500)/',
         Bay: null,
         Times:
          { sExact: '11:10 PM',
            eExact: '11:10 PM',
            sRelative: 'in 2 hours',
            eRelative: 'in 2 hours',
            eRelativeNoPrefix: '2 hours' } },
       { EDT: '/Date(1486443029000-0500)/',
         SDT: '/Date(1486443008000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486443029000-0500)/',
         STA: '/Date(1486443008000-0500)/',
         Dev: '00:00:21',
         Trip:
          { TripId: 2344,
            RunId: 342,
            BlockFareboxId: 342,
            TripRecordId: 2032,
            RunRecordId: 0,
            BlockRecordId: 58,
            ServiceLevelRecordId: 79,
            StopSequence: 368,
            PatternRecordId: 1924,
            TripStartTime: '/Date(1136177040000-0500)/',
            InternalSignDesc: '34 Lot 12/25',
            InternetServiceDesc: 'Lot 12/25 via CompSci',
            IVRServiceDesc: 'Lot 12/25 via CompSci',
            TripDirection: 'DOW' },
         LastUpdated: '/Date(1486435149330-0500)/',
         Bay: null,
         Times:
          { sExact: '11:50 PM',
            eExact: '11:50 PM',
            sRelative: 'in 2 hours',
            eRelative: 'in 2 hours',
            eRelativeNoPrefix: '2 hours' } } ],
    HeadwayDepartures: null },
  { RouteId: 20034,
    RouteRecordId: 5,
    Direction: 'Up',
    DirectionCode: 'UPW',
    IsHeadway: false,
    IsDone: false,
    Departures:
     [ { EDT: '/Date(1486437099000-0500)/',
         SDT: '/Date(1486437078000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486437099000-0500)/',
         STA: '/Date(1486437078000-0500)/',
         Dev: '00:00:21',
         Trip:
          { TripId: 2204,
            RunId: 342,
            BlockFareboxId: 342,
            TripRecordId: 2031,
            RunRecordId: 0,
            BlockRecordId: 58,
            ServiceLevelRecordId: 79,
            StopSequence: 438,
            PatternRecordId: 2000,
            TripStartTime: '/Date(1136171040000-0500)/',
            InternalSignDesc: '34 Orchard Hill',
            InternetServiceDesc: 'Orchard Hill via Sylvan',
            IVRServiceDesc: 'Orchard Hill via Sylvan',
            TripDirection: 'UPW' },
         LastUpdated: '/Date(1486435149267-0500)/',
         Bay: null,
         Times:
          { sExact: '10:11 PM',
            eExact: '10:11 PM',
            sRelative: 'in 31 minutes',
            eRelative: 'in 32 minutes',
            eRelativeNoPrefix: '32 minutes' } },
       { EDT: '/Date(1486439499000-0500)/',
         SDT: '/Date(1486439478000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486439499000-0500)/',
         STA: '/Date(1486439478000-0500)/',
         Dev: '00:00:21',
         Trip:
          { TripId: 2244,
            RunId: 342,
            BlockFareboxId: 342,
            TripRecordId: 2025,
            RunRecordId: 0,
            BlockRecordId: 58,
            ServiceLevelRecordId: 79,
            StopSequence: 438,
            PatternRecordId: 2000,
            TripStartTime: '/Date(1136173440000-0500)/',
            InternalSignDesc: '34 Orchard Hill',
            InternetServiceDesc: 'Orchard Hill via Sylvan',
            IVRServiceDesc: 'Orchard Hill via Sylvan',
            TripDirection: 'UPW' },
         LastUpdated: '/Date(1486435149293-0500)/',
         Bay: null,
         Times:
          { sExact: '10:51 PM',
            eExact: '10:51 PM',
            sRelative: 'in an hour',
            eRelative: 'in an hour',
            eRelativeNoPrefix: 'an hour' } },
       { EDT: '/Date(1486441899000-0500)/',
         SDT: '/Date(1486441878000-0500)/',
         ADT: null,
         ATA: null,
         ETA: '/Date(1486441899000-0500)/',
         STA: '/Date(1486441878000-0500)/',
         Dev: '00:00:21',
         Trip:
          { TripId: 2324,
            RunId: 342,
            BlockFareboxId: 342,
            TripRecordId: 2024,
            RunRecordId: 0,
            BlockRecordId: 58,
            ServiceLevelRecordId: 79,
            StopSequence: 438,
            PatternRecordId: 2000,
            TripStartTime: '/Date(1136175840000-0500)/',
            InternalSignDesc: '34 Orchard Hill',
            InternetServiceDesc: 'Orchard Hill via Sylvan',
            IVRServiceDesc: 'Orchard Hill via Sylvan',
            TripDirection: 'UPW' },
         LastUpdated: '/Date(1486435149317-0500)/',
         Bay: null,
         Times:
          { sExact: '11:31 PM',
            eExact: '11:31 PM',
            sRelative: 'in 2 hours',
            eRelative: 'in 2 hours',
            eRelativeNoPrefix: '2 hours' } } ],
    HeadwayDepartures: null } ];

    routeListDummy = { '20030':
   { RouteId: 20030,
     RouteRecordId: 2,
     ShortName: '30',
     LongName: 'North Amherst / Old Belchertown Rd',
     RouteAbbreviation: '30',
     IvrDescription: 'North Amherst Old Belchertown Rd',
     Color: 'C7A020',
     TextColor: 'FFFFFF',
     IsVisible: true,
     Group: null,
     SortOrder: 50,
     RouteTraceFilename: 'route30.kml',
     RouteTraceHash64: null,
     IsHeadway: false,
     IncludeInGoogle: true,
     GoogleDescription: 'North Amherst / Old Belchertown Rd',
     Stops: null,
     RouteStops: null,
     Directions: null,
     Vehicles:
      [ { VehicleId: 105,
          Name: '3201',
          Latitude: 42.386553,
          Longitude: -72.522381,
          RouteId: 20030,
          TripId: 2145,
          RunId: 4477,
          Direction: 'S',
          DirectionLong: 'Southbound',
          Destination: 'Old Belchertown Road',
          Speed: null,
          Heading: 162,
          Deviation: 1,
          OpStatus: 'ONTIME',
          CommStatus: 'GOOD',
          GPSStatus: 2,
          DriverName: null,
          LastStop: 'Fine Arts Center',
          OnBoard: 30,
          LastUpdated: '/Date(1486436019000-0500)/',
          DisplayStatus: 'On Time',
          BlockFareboxId: 305 },
        { VehicleId: 91,
          Name: '3211',
          Latitude: 42.375966,
          Longitude: -72.512871,
          RouteId: 20030,
          TripId: 2145,
          RunId: 4420,
          Direction: 'N',
          DirectionLong: 'Northbound',
          Destination: 'North Amherst',
          Speed: null,
          Heading: 272,
          Deviation: 0,
          OpStatus: 'ONTIME',
          CommStatus: 'GOOD',
          GPSStatus: 2,
          DriverName: null,
          LastStop: 'Gray Street (In)',
          OnBoard: 3,
          LastUpdated: '/Date(1486436005000-0500)/',
          DisplayStatus: 'On Time',
          BlockFareboxId: 302 } ],
     Messages: [] },
  '20031':
   { RouteId: 20031,
     RouteRecordId: 3,
     ShortName: '31',
     LongName: 'Sunderland / South Amherst',
     RouteAbbreviation: '31',
     IvrDescription: 'Sunderland South Amherst',
     Color: 'EF4E91',
     TextColor: 'FFFFFF',
     IsVisible: true,
     Group: null,
     SortOrder: 51,
     RouteTraceFilename: 'route31.kml',
     RouteTraceHash64: null,
     IsHeadway: false,
     IncludeInGoogle: true,
     GoogleDescription: 'Sunderland / South Amherst',
     Stops: null,
     RouteStops: null,
     Directions: null,
     Vehicles:
      [ { VehicleId: 85,
          Name: '3221',
          Latitude: 42.386564,
          Longitude: -72.522422,
          RouteId: 20031,
          TripId: 2136,
          RunId: 4425,
          Direction: 'S',
          DirectionLong: 'Southbound',
          Destination: 'South Amherst',
          Speed: null,
          Heading: 162,
          Deviation: 0,
          OpStatus: 'ONTIME',
          CommStatus: 'GOOD',
          GPSStatus: 2,
          DriverName: null,
          LastStop: 'Fine Arts Center',
          OnBoard: 30,
          LastUpdated: '/Date(1486435977000-0500)/',
          DisplayStatus: 'On Time',
          BlockFareboxId: 313 },
        { VehicleId: 101,
          Name: '3305',
          Latitude: 42.409546,
          Longitude: -72.530822,
          RouteId: 20031,
          TripId: 2133,
          RunId: 4489,
          Direction: 'N',
          DirectionLong: 'Northbound',
          Destination: 'Sunderland',
          Speed: null,
          Heading: 344,
          Deviation: 4,
          OpStatus: 'ONTIME',
          CommStatus: 'GOOD',
          GPSStatus: 2,
          DriverName: null,
          LastStop: 'North Amherst Center (Out)',
          OnBoard: 24,
          LastUpdated: '/Date(1486436001000-0500)/',
          DisplayStatus: 'Late',
          BlockFareboxId: 315 } ],
     Messages: [] },
  '20034':
   { RouteId: 20034,
     RouteRecordId: 5,
     ShortName: '34',
     LongName: 'Campus Shuttle Northbound',
     RouteAbbreviation: '34',
     IvrDescription: 'Campus Shuttle Northbound',
     Color: '00467E',
     TextColor: 'FFFFFF',
     IsVisible: true,
     Group: null,
     SortOrder: 54,
     RouteTraceFilename: 'route34.kml',
     RouteTraceHash64: null,
     IsHeadway: false,
     IncludeInGoogle: true,
     GoogleDescription: 'Campus Shuttle Northbound',
     Stops: null,
     RouteStops: null,
     Directions: null,
     Vehicles:
      [ { VehicleId: 117,
          Name: '3311',
          Latitude: 42.392902,
          Longitude: -72.532861,
          RouteId: 20034,
          TripId: 2144,
          RunId: 4496,
          Direction: 'DOW',
          DirectionLong: 'Down',
          Destination: 'Mullins Center via CompSci',
          Speed: null,
          Heading: 60,
          Deviation: 0,
          OpStatus: 'ONTIME',
          CommStatus: 'GOOD',
          GPSStatus: 2,
          DriverName: null,
          LastStop: 'Green Lot 25',
          OnBoard: 9,
          LastUpdated: '/Date(1486435988000-0500)/',
          DisplayStatus: 'On Time',
          BlockFareboxId: 342 } ],
     Messages: [] } };

}
