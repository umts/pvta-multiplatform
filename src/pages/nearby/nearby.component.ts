import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { StopDepartures } from '../../components/stop-departures/stop-departures.component.ts';
import { MapService } from '../../providers/map.service';
import { StopService } from '../../providers/stop.service';
import { StopDepartureService } from '../../providers/stop-departure.service';
import { RouteService } from '../../providers/route.service';
import { VehicleService } from '../../providers/vehicle.service';

import { StopComponent } from '../stop/stop.component';
import * as _ from 'lodash';

declare const google;

@Component({
  selector: 'page-nearby',
  templateUrl: 'nearby.html'
})
export class NearbyComponent {
  @ViewChild('map') mapElement: ElementRef;
  showBottomPanel: boolean = true;
  showBottomRightPanel: boolean = false;
  nearestStops;
  loadingStopsStatus: String;
  currentHighlightedStop;
  bounds;
  position;
  nearestStopsPromise;
  map: any;
  routes = [];
  // routesOnMap = [];
  routesPromise;
  stopsOnMap = [];
  vehiclesOnMap = [];
  vehiclesPromise;
  vehicles = [];
  numberOfStopsToShow: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public geolocation: Geolocation, private stopSvc: StopService,
  private alertCtrl: AlertController, private mapSvc: MapService,
  private routeSvc: RouteService, private stopDepartureSvc: StopDepartureService,
  private vehicleSvc: VehicleService, private ref: ChangeDetectorRef) {
    // Get location, then get nearest stops and load the map
    const options = {timeout: 5000, enableHighAccuracy: true};
    this.geolocation.getCurrentPosition(options).then(position => {
      this.position = position;
      this.getNearestStops();
      this.loadMap();
    }).catch(err => {
      console.error(`No location ${err}`);
      this.loadingStopsStatus = 'Error retrieving location';
    });
    this.routesPromise = this.routeSvc.getAllRoutes();
    this.routesPromise.then(routes => this.routes = routes);
    this.vehiclesPromise = this.vehicleSvc.getAllVehicles();
    this.vehiclesPromise.then(vs => this.vehicles = vs);
    this.loadingStopsStatus = 'Loading stops near you';
  }

  loadMap() {
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
      this.mapSvc.downloadGoogleMaps(() => this.mapsLoadedCallback());
    } else {
      this.mapsLoadedCallback();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NearbyPage');
  }

  mapsLoadedCallback() {
    // These coordinates draw a rectangle around all PVTA-serviced area. Used to restrict requested locations to only PVTALand
    let swBound = new google.maps.LatLng(41.93335, -72.85809);
    let neBound = new google.maps.LatLng(42.51138, -72.20302);
    this.bounds = new google.maps.LatLngBounds(swBound, neBound);

    let location = new google.maps.LatLng(
      this.position.coords.latitude, this.position.coords.longitude
    );

    if (!this.bounds.contains(location)) {
      console.error('Can\'t Use Current Location',
      'Your current location isn\'t in the PVTA\'s service area. Please search for a starting location above.');
      // Just use the UMass Campus Center
      location = new google.maps.LatLng(42.3918143, -72.5291417);
    }

    let mapOptions = {
      center: location,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      gestureHandling: 'cooperative',
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      styles: [{
        'featureType': 'transit.station.bus',
        'stylers': [{ 'visibility': 'off' }]
     }]
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.mapSvc.init(this.map);
    this.mapSvc.placeCurrentLocationMarker(location);
    Promise.resolve(this.nearestStopsPromise).then(() => {
      this.plotMarkersOnMap();
      console.log('adding bounds change listener');
      //  this.plotStopsOnMap();
      google.maps.event.addListener(this.map, 'idle', () => {
        console.log('bounds changed');
        this.plotMarkersOnMap();
        this.getRoutesForEachStop();
      });
    }).catch(err => console.error(err));
  }

  getRoutesForEachStop() {
    Promise.all([this.routesPromise, this.nearestStopsPromise]).then(values => {
      let [routes, stops] = values;
      // debugger;
      // console.log('opppp', values);
      // From each stop on the map:
      //   1. Get departures
      //   2. Get routeIds from each one
      //   3. Add RouteAbbreviation to infowindow
      for (let stop of this.stopsOnMap) {
        this.stopDepartureSvc.getStopDeparture(stop.stop.StopId).then(departures => {
          if (departures.length > 0) {
            departures[0].RouteDirections.map(d => d.RouteId);
            let routeIds = departures[0].RouteDirections.map(d => d.RouteId);
            let routeAbbreviations = [];
            for (let id of routeIds) {
              let x = routes.find(route => {
                return route.RouteId === id;
              });
              if (x) {
                routeAbbreviations.push(x.RouteAbbreviation);
              }
            }
            let str = `${stop.stop.Description}: routes that stop here ${routeAbbreviations.join(' ')}`;
            this.mapSvc.addMapListener(stop.marker, str, true);
            // console.log(stop.stop.Description + '\n' + '     ' + routeIds);
          } else {
            this.mapSvc.addMapListener(stop.marker, `${stop.stop.Description}: No routes stop here today`, true);
          }
        });
      }
    });
  }

  plotVehiclesOnMap(bounds) {
    Promise.all([this.vehiclesPromise, this.routesPromise]).then(values => {
      const [vehicles, routes] = values;
      let newVehiclesOnMap = [];
      for (let v of vehicles) {
        const loc = new google.maps.LatLng(v.Latitude, v.Longitude);
        if (bounds.contains(loc)) {
          const routeForThisVehicle = routes.find(r => r.RouteId === v.RouteId);
          console.log(`${routeForThisVehicle.RouteAbbreviation}: ${v.Heading}`);
          var icon = {
            path: this.mapSvc.vehicleSVGPath(v.Heading),
            fillColor: `#${routeForThisVehicle.Color}`,
            fillOpacity: 1,
            strokeWeight: 3,
            strokeColor: `#${routeForThisVehicle.Color}`,
            rotation: v.Heading,
            scale: .7,
            labelOrigin: new google.maps.Point(30, 33)
          };
          const marker = this.mapSvc.dropPin(loc, true, true, icon, {
            fontWeight: 'bold',
            fontSize: '11px',
            color: 'white',
            text: routeForThisVehicle.RouteAbbreviation.slice(-3)
          });
          const str = `
          <span style=\"color: #${routeForThisVehicle.Color}\">

          </span>

          `;
          var content = `
          <span style=\"color: #${routeForThisVehicle.Color}; font-weight: bold\">
            ${routeForThisVehicle.RouteAbbreviation}
          </span>
          : ${v.DirectionLong} toward <br>
          ${v.Destination} <br>
          Last Stop: ${v.LastStop}
          `;
          this.mapSvc.addMapListener(marker, content, true);
          marker.addListener('click', () => {
            this.mapSvc.toggleKMLs([routeForThisVehicle.RouteTraceFilename]);
          });
          newVehiclesOnMap.push({vehicle: v, marker: marker, route: routeForThisVehicle});
        }
      }
      // Angular doesn't catch this reassignment on its own, so manually
      // trigger the change detector
      this.vehiclesOnMap = newVehiclesOnMap;
      this.ref.detectChanges();
      console.log(this.vehiclesOnMap);
    });
  }

  plotStopsOnMap(bounds) {
    this.stopsOnMap = [];
    // console.log(bounds, this.nearestStops);
    for (let stop of this.nearestStops) {
      const x = new google.maps.LatLng(stop.Latitude, stop.Longitude);
      if (bounds.contains(x)) {
        if (this.mapSvc.getMarkers().length > 150) {
            this.mapSvc.removeAllMarkers();
            console.error('too many pins, try zooming in yo');
            break;
        } else {
            var icon = {
              path: this.mapSvc.busStopSVGPath(),
              fillColor: '#98012e',
              fillOpacity: 1,
              strokeWeight: 2.75,
              strokeColor: '#fff',
              scale: .07
            };
            const marker = this.mapSvc.dropPin(x, true, true, icon);
            this.stopsOnMap.push({stop: stop, marker: marker});
        }

      }
    }
  }

  plotMarkersOnMap() {
    this.mapSvc.removeAllMarkers();
    console.log('plot stops on map');
    const bounds = this.map.getBounds();
    this.plotStopsOnMap(bounds);
    this.plotVehiclesOnMap(bounds);
  }

  onCollapseToggleClicked() {
    this.showBottomPanel = !this.showBottomPanel;
  }

  getNearestStops() {
    this.nearestStopsPromise = this.stopSvc.getNearestStops(this.position.coords.latitude, this.position.coords.longitude);
    this.nearestStopsPromise.then(stops => {
      this.nearestStops = _.uniqBy(stops, 'StopId');
      this.seeMoreStops(5);
    }).catch(err => {
      console.error(err);
      this.loadingStopsStatus = 'Error downloading stops';
    });
  }
  onShowRightPanelClick(stop: number) {
    this.showBottomRightPanel = !this.showBottomRightPanel;
    this.currentHighlightedStop = stop;
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

  pickRoutesToMap() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Routes to See on Map');
    for (let route of this.routes) {
      alert.addInput({
        type: 'checkbox',
        label: route.RouteAbbreviation,
        value: route,
        checked: this.mapSvc.layerIsOnMap(route.RouteTraceFilename)
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data:', data);
        this.mapSvc.toggleKMLs(data.map(d => d.RouteTraceFilename));
      }
    });
    alert.present();
  }
  getRoutesOnMap() {
    // get all the filenames currently on the map
    const fileNames = this.mapSvc.getKMLLayers().map(l => l.fileName);
    // get all the routeabbreviations whose filenames are on the map
    return _.filter(this.routes, route => fileNames.includes(route.RouteTraceFilename))
    .map(filteredRoute => filteredRoute.RouteAbbreviation).join(', ');
  }

  seeFewerStops() {
    this.numberOfStopsToShow = this.numberOfStopsToShow - 5;
  }

  /*
   * Adds more stops to the Nearby Stops section of the page.
   * When a stop being added has an unknown distance from us,
   * we calculate it.
   * @param howManyMore - The number of additional stops we want to show
   */
  seeMoreStops(howManyMore: number): void {
    // Check for/calculate distance to each stop we're about to show
    for (let i = this.numberOfStopsToShow; i < this.numberOfStopsToShow + howManyMore; i++) {
      if (!stop.hasOwnProperty('Distance')) {
        // Calculate the distance from us to the stop
        this.nearestStops[i].Distance = this.stopSvc.calculateStopDistance(
          this.position, this.nearestStops[i]
        );
      }
    }
    this.numberOfStopsToShow = this.numberOfStopsToShow + howManyMore;
  }
}
