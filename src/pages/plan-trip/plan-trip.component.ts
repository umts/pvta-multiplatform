import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from 'ionic-native';
import { NavController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import {StopService} from '../../providers/stop.service';
import {StopComponent} from '../stop/stop.component';
import * as moment from 'moment';

// @TODO THIS ENTIRE COMPONENT IS A WORK IN PROGRESS; #ALPHA
declare var google;
@Component({
  selector: 'page-plan-trip',
  templateUrl: 'plan-trip.html'
})
export class PlanTripComponent {
  @ViewChild('directionsMap') mapElement: ElementRef;
  defaultMapCenter = new google.maps.LatLng(42.3918143, -72.5291417);//Coords for UMass Campus Center
  // These coordinates draw a rectangle around all PVTA-serviced area. Used to restrict requested locations to only PVTALand
   swBound = new google.maps.LatLng(41.93335, -72.85809);
   neBound = new google.maps.LatLng(42.51138, -72.20302);
   bounds = new google.maps.LatLngBounds(this.swBound, this.neBound);
   request;
   originForm: string = '';
   destionationForm: string = '';
   originPlace;
   originInput: string = '';
   destinationPlace;
   noLocation: boolean;
   loadedTrip;
   destinationInput;
   directionsDisplay;
   map;
   route;
   loader;
   placeService;
   timeOptions = []

  constructor(public navCtrl: NavController, private stopService: StopService,
  private toastCtrl: ToastController, private loadingCtrl: LoadingController,
  private alertCtrl: AlertController) {
    /* List of the different types of times that we can request trips.
     * Each type has a name (for the UI) and a few properties for us:
     * type: whether the user wants a "departure" or "arrival"
     * isASAP: whether we should ignore all other given times and
               request a trip leaving NOW
      */
    this.mapbounds = new google.maps.LatLngBounds();
    this.timeOptions = [
      { title: 'Leaving Now', type: 'departure', isASAP: true, id: 0 },
      { title: 'Departing At', type: 'departure', isASAP: false,id: 1 },
      { title: 'Arriving By...', type: 'arrival', isASAP: false, id: 2 }
    ];
  }
  /**
  * Checks whether we're trying to
  * get directions starting at the
  * current location.  If so, get it.
  * Otherwise, clear out the values
  * for origin so the user knows to type something.
 */
 updateOrigin(): void {
   if (this.request.destinationOnly) {
     this.loadLocation();
   } else {
     this.request.origin = {};
   }
 }
 //Loads the user's location and updates the origin
  loadLocation(): void {
    let options = {timeout: 5000, enableHighAccuracy: true};
    Geolocation.getCurrentPosition(options).then(position => {
      //geocode current position to retrieve its corresponding Google Maps ID
      new google.maps.Geocoder().geocode(
        {
          'location': new google.maps.LatLng(position.coords.latitude,position.coords.longitude)
        },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              this.originPlace = results[1];
              this.originInput = results[1].formatted_address;
              this.request.origin = {
                name: results[1].formatted_address,
                id: results[1].place_id
              };
              if (this.request.destination.name) {
                this.request.name = this.request.destination.name;
              }
            }
          }
        }
      );
      // this.getRoute();
    })
    .catch(err => {
      this.toastCtrl.create({
        message: 'Unable to retrieve current location',
        position: 'bottom',
        showCloseButton: true,
        dismissOnPageChange: true
        })
      .present();
      // Tell Google Analytics that a user doesn't have location
      // ga('send', 'event', 'LocationFailure', 'PlanTripConsoller.$cordovaGeolocation.getCurrentPosition', 'location failed on Plan Trip; error: ' + err.message);
      // When getting location fails, this callback fires
      this.noLocation = true;
      /* When getting location fails immediately, $ionicLoading.hide()
       * is never called (or the page refuses to redraw), so
       * we add a 1 second delay as a workaround.
       *
       * We also set the checkbox state after the delay, but solely
       * for user feedback (it otherwise would never change when clicked on)
       */
      setTimeout(() => {
        this.request.destinationOnly = false;
      }, 1000);
      console.error('unable to get location ' + err.message);
      // this.getRoute();
    });
  }

  /* Called when this page is opened, and either a loaded trip has been queued
   * or there are no current existing parameters. Also called as a result of the
   * newTrip method. Constructs the map, and then sets $scope.request as either default
   * or loaded parameters */
  reload(): void {
    // @TODO Scroll to input area first
    this.constructMap(this.defaultMapCenter);
    this.noLocation = false;
    // If we loaded a trip (user came via
    // saved trip on My Buses), pull out
    // its details and display them.
    if (this.loadedTrip) {
      this.request = this.loadedTrip;
      this.request.time.option = this.timeOptions[this.request.time.option];
      this.loadedTrip = null;
      // If the datetime of loeaded trip is in the past,
      // keep the time and update the date to today. Else do nothing.
      if (this.request.time.datetime < Date.now()) {
        this.request.time.datetime.setDate(new Date().getDate());
        this.request.time.datetime.setMonth(new Date().getMonth());
      }
      // If the request has destinationOnly -> true, the user originally used
      // Location Services to plan their trip. We assume they again want to
      // use their current location as the trip's origin.
      // If destinationOnly is false, then we use the origin that
      // was saved with the trip.
      if (this.request.destinationOnly) {
        this.request.origin = {};
        this.loadLocation();
      }
      else {
        // this.getRoute();
      }
      // ga('send', 'event', 'TripLoaded', 'PlanTripController.reload()', 'User has navigated to Plan Trip using a saved Trip.');
    }
    // There is no loaded trip.  Load the page with default parameters.
    // Attempt to use current location as trip's origin.
    else {
      this.request = {
        name: 'New Trip',
        time: {
          datetime: moment().format(),
          option: 0 // The ID of the timeOption the trip will use
        },
        origin: {},
        destination: {},
        destinationOnly: true,
        saved: false
      };
      this.loadLocation();
    }
  }

  ionViewWillEnter() {
    // @TODO Load saved trips
    // this.loadedTrip = Trips.pop();
    //@TODO reload if either a trip is being loaded or if this page has not yet been loaded
    // if (loadedTrip || !$scope.request)
    this.reload();
  }

  constructMap(latLng: any): void {
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(this.map);

    var originInput = <HTMLInputElement>document.getElementById('origin-input');
    var destinationInput = <HTMLInputElement>document.getElementById('destination-input');

    var originAutocomplete = new google.maps.places.Autocomplete(originInput);
    var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
    this.placeService = new google.maps.places.PlacesService(this.map);
    originAutocomplete.setBounds(this.bounds);
    destinationAutocomplete.setBounds(this.bounds);
    // When the user has selected a valid Place from the dropdown
    originAutocomplete.addListener('place_changed', () => {
      let place = originAutocomplete.getPlace();
      // debugger;
      if (!place || !place.geometry) {
        this.presentAlert('Invalid Origin', 'Choose a location from the list of suggestions.');
        // ga('send', 'event', 'AutocompleteFailure', 'originAutocomplete.place_changed', 'autocomplete failure in plan trip: ' + err);
        // If the location chosen is not valid, an error is thrown.
        // request.origin.name still holds the text that the user
        // originally typed into the field. We will set the field's value
        // back to this text.
        this.request.origin.id = null;
        originInput.value = this.request.origin.name;
        console.error('No geometry, invalid input.');
      } else if (!this.bounds.contains(place.geometry.location)) {
        this.presentAlert('Invalid Destination', 'The PVTA does not service this location.');
        console.error('Location ' + place.name + ' is out of bounds. ID: ' + place.id);
      } else {
        this.originPlace = place;
        this.request.origin = {
          name: place.name,
          id: place.place_id
        };
        this.request.destinationOnly = false;
        // Give the trip a default name if it has an origin AND destination.
        if (this.request.destination.name) {
          this.request.name = place.name + ' to ' + this.request.destination.name;
        }
      }
    });
    // When a valid destination is chosen:
    destinationAutocomplete.addListener('place_changed', () => {
      let place =  destinationAutocomplete.getPlace();
      if (!place || !place.geometry) {
        // @TODO Add invalidLocationPopup
        this.presentAlert('Invalid Destination', 'Choose a location from the list of suggestions.');
        // invalidLocationPopup('Choose a location from the list of suggestions.');
        console.error('No geometry, invalid input.');
      }
      else if (!this.bounds.contains(place.geometry.location)) {
        this.presentAlert('Invalid Destination', 'The PVTA does not service this location.');
        console.error('Location ' + place.name + ' is out of bounds. ID: ' + place.id);
      } else {
        this.destinationPlace = place;
        this.request.destination = {
          name: place.name,
          id: place.place_id
        };
        // Name the trip
        if (this.request.destinationOnly || !this.request.origin.name) {
          this.request.name = place.name;
        } else {
          // ORIGIN to DESTINATION if not destinationOnly
          this.request.name = this.request.origin.name + ' to ' + place.name;
        }
      }
    }, (err) => {
        // ga('send', 'event', 'AutocompleteFailure', 'destinationAutocomplete.place_changed', 'autocomplete failure in plan trip: ' + err);
        //See comments for originAutocompleteListener method
        this.request.destination.id = null;
        destinationInput.value = this.request.destination.name;
    });
  }
  mapbounds;
  mapLocation(place): void {
      //Fit the location on the map
      // debugger;
      console.log('totoitoto')
      this.mapbounds.extend(place.geometry.location);
  }

  presentAlert(title: string, body: string): void {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: body,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  checkForValidPlace(type: string, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      this.presentAlert(`Invalid ${type}`, `Unable to find a route. Error code: ${status}`)
    }
  }

  setRequestOrigin(place): void {
    console.log('origin place', place);
    this.originInput = place.formatted_address;
    this.request.origin = {
      name: place.formatted_address,
      id: place.place_id
    };
  }
  setRequestDestination(place): void {
    console.log('destination place', place);
     this.destinationInput = place.formatted_address;
    this.request.destination = {
      name: place.formatted_address,
      id: place.place_id
    };
  }

  /* Requests a trip from Google using the trip params.
   * This function is the crown jewel of this component.
   */
   getRoute(): void {
    // We need an origin and destination
    if (!this.request.origin.id || !this.request.destination.id) {
      console.error('Missing an origin or destination id');
      return;
    }
    // Google won't return trips for times past.
    // Instead of throwing an error, assume the user wants
    // directions for right now.
    if (!this.timeOptions[this.request.time.option].isASAP && this.request.time.datetime < Date.now()) {
      this.request.time.option = this.timeOptions[0].id;
      this.presentAlert('Invalid Trip Date',
      'Trips in the past are not supported. Defaulting to buses leaving now.');
      console.error('Trips in the past are not supported. Defaulting to buses leaving now.');
    }
    this.loader = this.loadingCtrl.create();
    this.loader.present();
    let transitOptions = {
      modes: [google.maps.TransitMode.BUS],
      routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
    };
    if (this.timeOptions[this.request.time.option].isASAP !== true) {
      if (this.timeOptions[this.request.time.option].type === 'departure') {
        // User wants departure in the future? Pass the time.
        transitOptions['departureTime'] = new Date(this.request.time.datetime);
      } else if (this.timeOptions[this.request.time.option].type === 'arrival') {
        // User wants arrival in the future? Pass the time.
        transitOptions['arrivalTime'] = new Date(this.request.time.datetime);
      } else {
        console.error('Determining route for Plan Trip failed due to unexpected input. Expected \'arrival\' or \'departure\', received');
        // ga('send', 'event', 'RoutingParamsInvalid', 'PlanTripController.getRoute()', 'Received invalid time params for planning a route');
        this.loader.dismiss();
        return;
      }
    }
    let directionsService = new google.maps.DirectionsService;
    /*
     * Send the official request to Google!
     */
    //  this.route = []
    directionsService.route(
      {
        origin: {'placeId': this.request.origin.id},
        destination: {'placeId': this.request.destination.id},
        travelMode: google.maps.TravelMode.TRANSIT,
        transitOptions: transitOptions
      },
      (response, status) => {
      console.log('directionsresponse', response, 'directionstatus', status);
      // @TODO figure out whether to add this back in
      // && this.confirmValidRoute(response.routes[0])
      if (status === google.maps.DirectionsStatus.OK ) {
        setTimeout(() => {
          this.loader.dismiss();
          google.maps.event.trigger(this.map, 'resize');
          // this.map.setZoom(10);
          this.directionsDisplay.setDirections(response);
          this.route = response.routes[0].legs[0];
          console.log('map idle')
          console.log(this.originPlace);
          console.log(this.destinationPlace);
          // this.mapLocation(this.originPlace);
          // this.mapLocation(this.destinationPlace);
          // this.map.fitBounds(this.mapbounds);
        }, 1000);
        setTimeout(() => {
          google.maps.event.trigger(this.map, 'resize');
          console.log('tits');
          this.directionsDisplay.setDirections(response);
        }, 2000)
        // @TODO scroll to route being displayed in UI
        // $scope.scrollTo('route');

        // Force a map redraw because it was hidden before.
        // There's STILL an angular bug (with [hidden]) that will cause
        // the map to draw only grey after being hidden
        // unless we force a redraw after a brief delay.
        // ga('send', 'event', 'TripStepsRetrieved', ser 'PlanTripController.getRoute()', 'Received steps for a planned trip!');
      } else  {
        console.log(status);
        // @TODO Add the popup
        // $ionicPopup.alert(
        //   {
        //     title: 'Unable to Find Trip',
        //     template: 'There are no scheduled buses for your trip.<br>Status Code: ' + status
        //   }
        // );
        // ga('send', 'event', 'TripStepsRetrievalFailure', 'PlanTripController.$scope.getRoute()', 'Unable to get a route; error: ' + status);

        // In cases of error, we set the route object that
        // otherwise contained all our data to undefined, because, well,
        // the data was bad.
        this.route = undefined;
      }
    });
    // this.loader.dismiss();
    // @TODO figure out of this should be a thing?
    // , function (err) {
    //   this.route = undefined;
    //   // $ionicLoading.hide();
    //   console.log('Error routing: ' + err);
    //   // ga('send', 'event', 'TripStepsRoutingFailure', 'PlanTripController.$scope.getRoute()', 'Trip Factory unable to get a route due to some error: ' + err);
    // });
  }
  confirmValidRoute(route): boolean {
    return !(route.legs[0].steps.length === 1 && route.legs[0].steps[0]['travel_mode'] === 'WALKING');
  }
  /*
   * Saves the current trip parameters to the db
   * for display on My Buses
  */
  saveTrip(): void {
    var prevName = this.request.name;
    console.log('saving trip yo');
     // @TODO Show the dialog for naming trip
     // $ionicPopup.show({
      //   template: '<input type="text" role="dialog" placeholder="Give this trip a name" ng-model="request.name" aria-live="assertive">',
      //   title: 'Trip Name',
      //   scope: $scope,
      //   buttons: [
      // {text: 'Cancel',
      //   onTap: function () {
      //     $scope.request.name = prevName;
      //   }},
      //   {text: '<b>OK</b>',
      //     type: 'button-positive',
      // @TODO Save the trip
      //   onTap: function () {
      //     if ($scope.request.saved) {
      //       Trips.set($scope.request);
      //     }
      //     else {
      //       $scope.request.saved = true;
      //       Trips.add($scope.request);
      //     }
      //     saveSuccessful();}
      //   }]
      // });
  }

  /* Allows for location selection on google
  * typeahead on mobile devices
  */
  disableTap(): void {
    console.log('disable tap');
    // @TODO Figure out if this needs to be a thing
    //  let container = document.getElementsByClassName('pac-container');
    // disable ionic data tap
    //  element(container).attr('data-tap-disabled', 'true');
    //  angular.element(container).attr('id', 'places');
    //  leave input field if google-address-entry is selected
    //  angular.element(container).on('click', function () {
    //    document.getElementById('origin-input').blur();
    //    document.getElementById('destination-input').blur();
    //  });
  }

  goToStop(loc): void {
    // @TODO Show loader
    this.stopService.getNearestStop(loc.lat(), loc.lng()).then(stop => {
      // @TODO Hide loader
      this.navCtrl.push(StopComponent, {stopId: stop.StopId});
    });
  }
}
