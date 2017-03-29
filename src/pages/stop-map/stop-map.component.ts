import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import { Stop } from '../../models/stop.model';
import { MapService } from '../../providers/map.service';
import { StopService } from '../../providers/stop.service';

declare var google;

@Component({
  selector: 'page-stop-map',
  templateUrl: 'stop-map.html'
})
export class StopMapComponent {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directions') directionsElement: ElementRef;
  displayDirections: boolean = false;
  map: any;
  directionsDisplay: any;
  stopId: number;
  stop: Stop;
  directionsRequested: boolean = false;
  directionsObtained: boolean = false;
  mapHeight: string = '100%';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private stopSvc: StopService, private mapSvc: MapService, private zone: NgZone) {
    this.stopId = navParams.get('stopId');
  }
  directionsService = new google.maps.DirectionsService();

  ionViewDidEnter() {
    // $ionicLoading.show(ionicLoadingConfig);
    let mapOptions = {
      // Sets the center to Haigis Mall
      center: new google.maps.LatLng(42.386270, -72.525844),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // The map div can have one of two ids:
    // one when directions are being shown, the other when not.
    // Check which id the map has, pluck it from the HTML, and bind it
    // to a variable.
    this.map = new google.maps.Map(this.mapElement.nativeElement,
      mapOptions);
    this.mapSvc.init(this.map);
    // Be ready to display directions if the user requests them.
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.directionsDisplay.setMap(this.map);
    // Download the stop details and plot it on the map.
    this.stopSvc.getStop(this.stopId).then(stop => {
      console.log(stop);
      this.stop = stop;
      this.placeStop(stop);
      // $ionicLoading.hide();
    });
  }



  /****
  * Plots a stop on the map.  When clicked, the marker
  * will display a popup that gives some details about the stop.
  * Stop data needs to already have been loaded before this
  * function will succeed.
  */
  placeStop(stop: Stop): void {
    // If we have stop details, plot it.
    console.log('about to place marker yo')
    let loc = new google.maps.LatLng(stop.Latitude, stop.Longitude);
    let marker = this.mapSvc.placeStaticMarker(loc, `${stop.Description}  (${stop.StopId})`);
    this.mapSvc.addMapListener(marker, '');
  }

  /***
   * Gets directions from the user's current location
   * to the stop in question and displays them on the UI.
  */
  calculateDirections(): void {
    this.directionsRequested = true;
    this.directionsObtained = false;
    this.mapHeight = '90%';
    console.log('calculateDirections')
    // $ionicLoading.show(ionicLoadingConfig);
    // A callback that we pass to the plotCurrentLocation
    // function below.  Handles actually getting
    // and displaying directions once we have a location.
    Geolocation.getCurrentPosition().then(position => {
      // If we have a location, download and display directions
      // from here to the stop.
      // this.noLocation = false;
      this.displayDirections = true;
      this.directionsDisplay.setPanel(this.directionsElement.nativeElement);
      let start = position;
      // var end = this.placeStop();
      var request = {
        origin: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        destination: new google.maps.LatLng(this.stop.Latitude, this.stop.Longitude),
        travelMode: google.maps.TravelMode.WALKING
      };
      this.getDirections(request);
    }).catch(err => {
      console.log('unable to get current location');
      // this.noLocation = true;
      this.displayDirections = false;
      // Tell Google Analytics that a user doesn't have location
      // ga('send', 'event', 'LocationFailure', '$cordovaGeolocation.getCurrentPosition', 'location failure passed to Stop Map after failing on Map Factory');
    });
  }

  getDirections(request): void {
    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(result);
        // Use NgZone to trigger change detection for events that brought us
        // us outside Angular's detection zone, like this directions request
        this.zone.run(() => {
          this.mapHeight = '50%';
          this.directionsObtained = true
          google.maps.event.trigger(this.map, "resize");
        });
      }
    });
  }
      // $ionicLoading.hide();
    // };
    // Get the current location. Once we have (or definitively don't have)
    // a location, the callback passed as a param will be called.
    // Map.plotCurrentLocation(cb);
}
