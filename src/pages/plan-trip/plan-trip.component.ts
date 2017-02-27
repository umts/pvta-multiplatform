import { Component } from '@angular/core';
import { Geolocation } from 'ionic-native';
import { NavController } from 'ionic-angular';
import {StopService} from '../../providers/stop.service';
import {StopComponent} from '../stop/stop.component';
@Component({
  selector: 'page-plan-trip',
  templateUrl: 'plan-trip.html'
})
export class PlanTripComponent {

  defaultMapCenter = new google.maps.LatLng(42.3918143, -72.5291417);//Coords for UMass Campus Center
  // These coordinates draw a rectangle around all PVTA-serviced area. Used to restrict requested locations to only PVTALand
   swBound = new google.maps.LatLng(41.93335, -72.85809);
   neBound = new google.maps.LatLng(42.51138, -72.20302);
   bounds = new google.maps.LatLngBounds(this.swBound, this.neBound);
   request;
   noLocation: boolean;
   loadedTrip;
   directionsDisplay;
   map;
   route;

  constructor(public navCtrl: NavController, private stopService: StopService) {}
  /*
   * List of the different types
   * of times that we can request trips.
   * Each type has a name that we
   * use in the UI and a few
   * properties for us.
   */
  timeOptions = [
    {
      title: 'Leaving Now', // for the UI
      type: 'departure', // whether the user wants to depart or arrive at the given time
      isASAP: true, // whether we should ignore all other given times and request a trip leaving NOW
      id: 0
    },
    {
      title: 'Departing At...',
      type: 'departure',
      isASAP: false,
      id: 1
    },
    {
      title: 'Arriving By...',
      type: 'arrival',
      isASAP: false,
      id: 2
    }
  ];
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
    // let deferred = $q.defer();
    let options = {timeout: 5000, enableHighAccuracy: true};
    // $ionicLoading.show(ionicLoadingConfig);

    Geolocation.getCurrentPosition(options).then(position => {
      // $ionicLoading.hide();

      //geocode current position to retrieve its corresponding Google Maps ID
      new google.maps.Geocoder().geocode({
        'location': new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
      }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            this.request.origin = {
              name: results[1].formatted_address,
              id: results[1].place_id
            };
            if (this.request.destination.name) {
              this.request.name = this.request.destination.name;
            }
            // deferred.resolve();
          }
        }
      });
      //TODO
      this.getRoute();
    }).catch(err => {
      // Map.showInsecureOriginLocationPopup(err);
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
        // $ionicLoading.hide();
        this.request.destinationOnly = false;
      }, 1000);
      console.error('unable to get location ' + err.message);
      //TODO
      this.getRoute();
    });

    // return deferred.promise;
  }

  //Called when this page is opened, and either a loaded trip has been queued
  //or there are no current existing parameters. Also called as a result of the
  //newTrip method. Constructs the map, and then sets $scope.request as either default
  //or loaded parameters
  reload(): void {
    // $scope.scrollTo('input');
    this.constructMap(this.defaultMapCenter);
    this.noLocation = false;
    // If we loaded a trip (user came via
    // saved trip on My Buses), pull out
    // its details and display them.
    if (this.loadedTrip) {
      this.request = this.loadedTrip;
      this.request.time.option = this.timeOptions[this.request.time.option.id];
      this.loadedTrip = null;

      //Fix the time of the saved trip. If the datetime is in the future, keep it
      //If the datetime is in the past, keep the time and update the date to today's.
      if (this.request.time.datetime < Date.now()) {
        this.request.time.datetime.setDate(new Date().getDate());
        this.request.time.datetime.setMonth(new Date().getMonth());
      }

      //If the request has destinationOnly -> true, that implies
      //that the user originally used Location Services to plan
      //their trip. We assume that the user again wants to
      // use their current location as the trip's origin.
      // If destinationOnly is false, then we use the origin that
      // was saved with the trip.
      if (this.request.destinationOnly) {
        this.request.origin = {};
        this.loadLocation();
        // .then(function () {
        //   this.getRoute();
        // });
      }
      else {
        this.getRoute();
      }

      // ga('send', 'event', 'TripLoaded', 'PlanTripController.reload()', 'User has navigated to Plan Trip using a saved Trip.');
    }
    //There is no loaded trip, so load the page with default (empty) parameters
    //And attempt to use current location as trip's origin
    else {
      this.request = {
        name: 'New Trip',
        time: {
          datetime: new Date(),
          option: this.timeOptions[0]
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
    // this.loadedTrip = Trips.pop();
    // if (loadedTrip || !$scope.request)//reload if either a trip is being loaded or if this page has not yet been loaded
    this.reload();
  }

  constructMap(latLng: any): void {
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(document.getElementById('directions-map'), mapOptions);


      this.directionsDisplay = new google.maps.DirectionsRenderer;

      this.directionsDisplay.setMap(this.map);

      var originInput = <HTMLInputElement>document.getElementById('origin-input');
      var destinationInput = <HTMLInputElement>document.getElementById('destination-input');

      var originAutocomplete = new google.maps.places.Autocomplete(originInput);
      var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
      originAutocomplete.setBounds(this.bounds);
      destinationAutocomplete.setBounds(this.bounds);


      originAutocomplete.addListener('place_changed', function () {
        this.mapLocation(originAutocomplete.getPlace(), function (place) {
          this.request.origin = {
            name: place.name,
            id: place.place_id
          };
          this.request.destinationOnly = false;
          //Name the trip if there is a destination: ORIGIN to DESTINATION
          if (this.request.destination.name) {
            this.request.name = place.name + ' to ' + this.request.destination.name;
          }
        }, function (err) {
          // ga('send', 'event', 'AutocompleteFailure', 'originAutocomplete.place_changed', 'autocomplete failure in plan trip: ' + err);
          //If the location chosen is not valid, an error is thrown.
          //$scope.request.origin.name still holds the text that the user
          //originally typed into the field. We will set the field's value
          //back to this text
          this.request.origin.id = null;
          originInput.value = this.request.origin.name;
        });
      });

      destinationAutocomplete.addListener('place_changed', function () {
        this.mapLocation(destinationAutocomplete.getPlace(), function (place) {
          this.request.destination = {
            name: place.name,
            id: place.place_id
          };
          //Name the trip: ORIGIN to DESTINATION if not destinationOnly, otherwise just DESTINATION
          if (this.request.destinationOnly || !this.request.origin.name) {
            this.request.name = place.name;
          } else {
            this.request.name = this.request.origin.name + ' to ' + place.name;
          }
        }, function (err) {
          // ga('send', 'event', 'AutocompleteFailure', 'destinationAutocomplete.place_changed', 'autocomplete failure in plan trip: ' + err);
          //See comments for originAutocompleteListener method
          this.request.destination.id = null;
          destinationInput.value = this.request.destination.name;
        });
      });
    }

    mapLocation(place, success, error): void {
      if (!place.geometry) {
        // invalidLocationPopup('Choose a location from the list of suggestions.');
        error('No geometry, invalid input.');
      }
      else if (!this.bounds.contains(place.geometry.location)) {
        // invalidLocationPopup('PVTA does not service this location.');
        error('Location ' + place.name + ' is out of bounds. ID: ' + place.id);
      } else {
        //Fit the location on the map
        if (place.geometry.viewpoint) {
          this.map.fitBounds(place.geometry.viewpoint);
        } else {
          this.map.setCenter(place.geometry.location);
          this.map.setZoom(17);
        }
        //success callback
        success(place);
      }
    }
    /*
       *
       * Uses all the trip params and
       * requests a trip from Google.
       */
      getRoute(): void {
        // We need an origin and destination
        if (!this.request.origin.id || !this.request.destination.id) {
          return;
        }

        // Google won't return trips for times past.
        // Instead of throwing an error, assume the user wants
        // directions for right now.
        if (!this.request.time.option.isASAP && this.request.time.datetime < Date.now()) {
          this.request.time.option = this.timeOptions[0];
          // $ionicPopup.alert({
          //   title: 'Invalid Trip Date',
          //   template: 'Trips in the past are not supported. Defaulting to buses leaving now.'
          // });
          console.error('Trips in the past are not supported. Defaulting to buses leaving now.');
        }

        // $ionicLoading.show({
        //   template: 'Routing..',
        //   timeout: 5000
        // });

        let transitOptions = {
          modes: [google.maps.TransitMode.BUS],
          routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
        };

        if (this.request.time.option.isASAP !== true) {
          if (this.request.time.option.type === 'departure') {
            transitOptions['departureTime'] = this.request.time.datetime;
          }
          else if (this.request.time.option.type === 'arrival') {
            transitOptions['arrivalTime'] = this.request.time.datetime;
          }
          else {
            console.error('Determining route for Plan Trip failed due to unexpected input. Expected \'arrival\' or \'departure\', received');
            // ga('send', 'event', 'RoutingParamsInvalid', 'PlanTripController.getRoute()', 'Received invalid time params for planning a route');
            return;
          }
        }

        let directionsService = new google.maps.DirectionsService;
        directionsService.route(
          {
            origin: {'placeId': this.request.origin.id},
            destination: {'placeId': this.request.destination.id},
            travelMode: google.maps.TravelMode.TRANSIT,
            transitOptions: transitOptions
          },
          (response, status) => {
          console.log(response);
          // $ionicLoading.hide();
          // && this.confirmValidRoute(response.routes[0])
          if (status === google.maps.DirectionsStatus.OK ) {
            this.directionsDisplay.setDirections(response);
            this.route = response.routes[0].legs[0];
            // $scope.scrollTo('route');
            // Force a map redraw because it was hidden before.
            // There's an angular bug with ng-show that will cause
            // the map to draw only grey after being hidden
            // unless we force a redraw.
            google.maps.event.trigger(this.map, 'resize');
            // ga('send', 'event', 'TripStepsRetrieved', 'PlanTripController.getRoute()', 'Received steps for a planned trip!');
          } else  {
            console.log(status);
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

  /**
     * Saves the current trip parameters to the db
     * for display on My Buses
     */
  saveTrip(): void {
    var prevName = this.request.name;
    console.log('saving trip yo');
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
  //  let container = document.getElementsByClassName('pac-container');
  //  // disable ionic data tap
  //  element(container).attr('data-tap-disabled', 'true');
  //  angular.element(container).attr('id', 'places');
  //  // leave input field if google-address-entry is selected
  //  angular.element(container).on('click', function () {
  //    document.getElementById('origin-input').blur();
  //    document.getElementById('destination-input').blur();
  //  });
 }

 /*
   * Callback function for when the user uses
   * the time picker to select a time.
   * Sets the trip param's time property
   * so we can request a trip at a specific time.
   * @param: time, an int in Unix Epoch
   */
  onTimeChosen(time): void {
    if (typeof (time) === 'undefined') {
      var error = 'Received undefined time from timepicker.';
      console.error(error);
      // ga('send', 'event', 'TimePickerReturnedBadValue', 'PlanTripController.onTimeChosen()', 'Received undefined time from timepicker.');
    } else {
      // Make the input into a Javascript date object
      var selectedTime = new Date(time * 1000);
      // Pull the hours and minutes; we don't care about
      // anything else
      this.request.time.datetime.setHours(selectedTime.getUTCHours());
      this.request.time.datetime.setMinutes(selectedTime.getUTCMinutes());
      // ga('send', 'event', 'TripTimeChosen', 'PlanTripController.onTimeChosen()', 'Custom time for trip was set!');
    }
  }

  /*
   * Callback function for when user
   * has selected a date in the datepicker.
   * Sets the trip params date property
   * so we can request trips on a specific date
   */
  onDateChosen(date): void {
    if (date) {
      date = new Date(date);
      this.request.time.datetime.setDate(date.getDate());
      this.request.time.datetime.setMonth(date.getMonth());
      this.request.time.datetime.setFullYear(date.getFullYear());
      // ga('send', 'event', 'TripDateChosen', 'PlanTripController.onDateChosen()', 'Custom date for trip was set!');
    }
    else {
      var error = 'Received undefined date from datepicker.';
      console.error(error);
      // ga('send', 'event', 'DatePickerReturnedBadValue', 'PlanTripController.onDateChosen()', error);
    }
  }

  /*
   * Wrapper function for opening the
   * time picker in the UI.
   */
  openTimePicker = function () {
    console.log('time picker');
    // var timePickerConfig = {
    //   callback: onTimeChosen,
    //   inputTime: $scope.request.time.datetime.getHours() * 60 * 60 + $scope.request.time.datetime.getMinutes() * 60,
    //   format: 12,         //Optional
    //   step: 1,           //Optional
    // };
    // ionicTimePicker.openTimePicker(timePickerConfig);
  }
  goToStop(loc): void {
    this.stopService.getNearestStop(loc.lat(), loc.lng()).then(stop => {
      this.navCtrl.push(StopComponent, {stopId: stop.StopId});
    });
  };
}
