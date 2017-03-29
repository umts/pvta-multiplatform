import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
  displayDirections: boolean = false;
  map: any;
  directionsDisplay: any;
  stopId: number;
  stop: Stop;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private stopSvc: StopService, private mapSvc: MapService) {
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
  calculateDirections = function () {
    // $ionicLoading.show(ionicLoadingConfig);
    // A callback that we pass to the plotCurrentLocation
    // function below.  Handles actually getting
    // and displaying directions once we have a location.
    var cb = function (position) {
      // If we weren't able to get a location for any reason,
      // we should encounter a falsy.
      if (!position) {
        console.log('unable to get current location');
        this.noLocation = true;
        this.displayDirections = false;
        // Tell Google Analytics that a user doesn't have location
        // ga('send', 'event', 'LocationFailure', '$cordovaGeolocation.getCurrentPosition', 'location failure passed to Stop Map after failing on Map Factory');
      } else {
        // If we have a location, download and display directions
        // from here to the stop.
        this.noLocation = false;
        this.displayDirections = true;
        this.directionsDisplay.setPanel(document.getElementById('directions'));
        let start = position;
        var end = this.placeStop();
        var request = {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.WALKING
        };
        this.directionsService.route(request, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.directionsDisplay.setDirections(result);
          }
        });
      }
      // $ionicLoading.hide();
    };
    // Get the current location. Once we have (or definitively don't have)
    // a location, the callback passed as a param will be called.
    // Map.plotCurrentLocation(cb);
  };


}
