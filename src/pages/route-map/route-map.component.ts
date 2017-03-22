import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ConnectivityService } from '../../providers/connectivity.service';
import { RouteService } from '../../providers/route.service';
import { VehicleService } from '../../providers/vehicle.service';
import { Route } from '../../models/route.model';
import { Vehicle } from '../../models/vehicle.model';
import * as moment from 'moment';
import { MapService } from '../../providers/map.service';
import { AutoRefreshService } from '../../providers/auto-refresh.service';

declare var google;

@Component({
  selector: 'page-route-map',
  templateUrl: 'route-map.html'
})
export class RouteMapComponent {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  routeId: number;
  route: Route;
  interval: number;
  vehicles: Vehicle[];
  mapOptions = {
    center: new google.maps.LatLng(42.386270, -72.525844),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private routeSvc: RouteService, private vehicleSvc: VehicleService,
    private mapSvc: MapService, private connection: ConnectivityService,
    private refreshSvc: AutoRefreshService, private storage: Storage) {
      this.routeId = navParams.get('routeId');
    }

  ionViewDidEnter() {
    this.loadMap();
    // $ionicLoading.show(ionicLoadingConfig);
    this.routeSvc.getRoute(this.routeId).then(route => {
      if (!route) {
        return;
      }
      this.route = route;
      this.vehicles = route.Vehicles;
      this.mapSvc.addKML(route.RouteTraceFilename);
      this.placeVehicles(false);
    });
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
            this.getVehicles();
          }, autoRefresh);
        }
      });
    });
  }

  ionViewCanEnter(): boolean {
   return this.connection.getConnectionStatus();
  }

  ionViewWillLeave() {
    clearInterval(this.interval);
  }

  getVehicles() {
    console.log('Refreshing vehicles');
    this.vehicleSvc.getRouteVehicles(this.routeId)
    .then(routeVehicles => {
      if (!routeVehicles) {
        return;
      }
      this.vehicles = routeVehicles;
      this.placeVehicles(true);
    });
  }

  loadMap(): void {
    this.map = new google.maps.Map(this.mapElement.nativeElement,
      this.mapOptions);
    this.mapSvc.init(this.map);
  }

  placeVehicles (isVehicleRefresh) {
    // Places every vehicle on said route on the map
      this.mapSvc.removeAllMarkers();
      if (!this.vehicles) {
        return;
      }
      for (let vehicle of this.vehicles) {
        let fullTitle = `<b style=\"color:`;
        let busDetails = `Bus ${vehicle.Name} - ${vehicle.DisplayStatus}`;
        var loc = new google.maps.LatLng(vehicle.Latitude, vehicle.Longitude);
        // If the vehicle is on time, make the text green. If it's late, make the text red and say late by how much
        if (vehicle.DisplayStatus === 'On Time') {
          fullTitle += `green\"> ${busDetails}`;
        } else {
          fullTitle += `red\"> ${busDetails} by ${vehicle.Deviation} minutes`;
        }
        fullTitle += '</b>';

        // Sets the content of the window to have a ton of information about the vehicle
        var content = `
        <div style=\"text-align: center\; font-weight: bold; font-size: 125%;">
          <p style=\"color: #${this.route.Color}\">
            ${this.route.RouteAbbreviation}:
            ${vehicle.Destination}
          </p>
          ${fullTitle}
          <p>Last Stop: ${vehicle.LastStop}</p>
          <p>
            Last Updated: ${moment(vehicle.LastUpdated).format('h:mm:ss a')}
          </p>
        </div>`;
        // An bus-shaped icon, with the color of the current route and
        // rotated such that it is facing the same direction as the real bus.
        var icon = {
          path: this.mapSvc.busSVGPath(),
          fillColor: '#' + this.route.Color,
          fillOpacity: 1,
          strokeWeight: 1.5,
          scale: .04,
          // 180 degrees is rightside-up
          rotation: vehicle.Heading + 180
        };
        // Add a listener for that vehicle with that content as part of the infobubble
        this.mapSvc.addMapListener(this.mapSvc.placeDesiredMarker(loc, icon, isVehicleRefresh), content);
      }
    }

}
