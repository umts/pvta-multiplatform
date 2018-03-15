import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NavController, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { StopService } from '../../providers/stop.service';
import { MapService } from '../../providers/map.service';
import { FavoriteTripService } from '../../providers/favorite-trip.service';
import { InfoService } from '../../providers/info.service';
import { StopComponent } from '../stop/stop.component';
import { ToastService } from '../../providers/toast.service';
import * as moment from 'moment';

declare var google, ga;
@Component({
  selector: 'page-plan-trip',
  templateUrl: 'plan-trip.html'
})
export class PlanTripComponent {
  @ViewChild('directionsMap') mapElement: ElementRef;
  @ViewChild('routeScrollArea') routeElement: ElementRef;
  bounds;
  request;
  originPlace;
  originInput: string = '';
  destinationPlace;
  noLocation: boolean;
  destinationInput;
  directionsDisplay;
  map;
  route;
  loader;
  timeOptions = [];
  noLocationToast;
  toastHandler;
  originDestToast;
  isInternetExplorer: boolean = false;

  constructor(public navCtrl: NavController, private stopService: StopService,
    private loadingCtrl: LoadingController, private alertCtrl: AlertController,
    private tripService: FavoriteTripService, private navParams: NavParams,
    private infoSvc: InfoService, private mapSvc: MapService,
    private geolocation: Geolocation, private toastSvc: ToastService) {
    /* List of the different types of times that we can request trips.
     * Each type has a name (for the UI) and a few properties for us:
     * type: whether the user wants a "departure" or "arrival"
     * isASAP: whether we should ignore all other given times and
               request a trip leaving NOW
      */
    this.isInternetExplorer = this.infoSvc.isInternetExplorer();
    this.timeOptions = [
      { title: 'Leaving Now', type: 'departure', isASAP: true, id: 0 },
      { title: 'Departing At...', type: 'departure', isASAP: false, id: 1 },
      { title: 'Arriving By...', type: 'arrival', isASAP: false, id: 2 }
    ];
    ga('set', 'page', '/plan-trip.html');
    ga('send', 'pageview');
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
 // Loads the user's location and updates the origin
  loadLocation(): void {
    let options = {timeout: 5000, enableHighAccuracy: true};
    this.geolocation.getCurrentPosition(options).then(position => {
      // Geocode current position to retrieve its corresponding Google Maps ID
      new google.maps.Geocoder().geocode(
        {
          'location': new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            console.log(results);
            if (results[0] && this.bounds.contains(results[0].geometry.location)) {
              let closestGeolocationAddress = results[0];
              this.originPlace = closestGeolocationAddress;
              this.originInput = closestGeolocationAddress.formatted_address;
              this.request.origin = {
                name: closestGeolocationAddress.formatted_address,
                id: closestGeolocationAddress.place_id
              };
              if (this.request.destination.name) {
                this.request.name = this.request.destination.name;
              }
            } else {
              this.presentAlert('Can\'t Use Current Location',
              'Your current location isn\'t in the PVTA\'s service area. Please search for a starting location above.');
            }
          }
        }
      );
      // this.getRoute();
    })
    .catch(err => {
      this.noLocationToast = this.toastSvc.noLocationToast();
      // Tell Google Analytics that a user doesn't have location
      ga('send', 'event', 'LocationFailure',
      'PlanTripComponent.loadLocation()', `location failed on Plan Trip; error: ${err.message}`);
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
   * newTrip method. Constructs the map, and then sets this.request as either default
   * or loaded parameters */
  reload(loadedTrip): void {
    // @TODO Scroll to input area first
    this.constructMap();
    this.noLocation = false;
    // If we loaded a trip (user came via
    // saved trip on Favorites), pull out
    // its details and display them.
    if (loadedTrip) {
      this.request = loadedTrip;
      loadedTrip = null;
      // If the datetime of loeaded trip is in the past,
      // keep the time and update the date to today. Else do nothing.
      if (this.request.time.datetime < Date.now()) {
        this.request.time.datetime.setDate(new Date().getDate());
        this.request.time.datetime.setMonth(new Date().getMonth());
      }
      // A planned trip from 1.x saves the entire Option object,
      // so if we see this, just change it be the id it already contains
      // so that we can use the timeOptions from above.
      if (typeof(this.request.time.option) !== 'number') {
        this.request.time.option = this.request.time.option.id;
      }
      // If the request has destinationOnly -> true, the user originally used
      // Location Services to plan their trip. We assume they again want to
      // use their current location as the trip's origin.
      // If destinationOnly is false, then we use the origin that
      // was saved with the trip.
      if (this.request.destinationOnly) {
        this.request.origin = {};
        this.loadLocation();
      } else {
        this.getRoute();
      }
      ga('send', 'event', 'TripLoaded', 'PlanTripComponent.reload()',
      'User has navigated to Plan Trip using a saved Trip.');
    } else {
      // There is no loaded trip.  Load the page with default parameters.
      // Attempt to use current location as trip's origin.
      this.request = {
        name: 'Schedule',
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

  mapsLoadedCallback = (loadedTrip) => {
    let swBound = new google.maps.LatLng(41.93335, -72.85809);
    let neBound = new google.maps.LatLng(42.51138, -72.20302);
    this.bounds = new google.maps.LatLngBounds(swBound, neBound);
   console.log(loadedTrip);
   this.reload(loadedTrip);
  }

  ionViewWillEnter() {
    // defaultMapCenter = new google.maps.LatLng(42.3918143, -72.5291417);//Coords for UMass Campus Center
    // These coordinates draw a rectangle around all PVTA-serviced area. Used to restrict requested locations to only PVTALand
    let loadedTrip = this.navParams.get('loadedTrip');
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
      this.mapSvc.downloadGoogleMaps(() => this.mapsLoadedCallback(loadedTrip));
    } else {
      this.mapsLoadedCallback(loadedTrip);
    }



  }

  constructMap(): void {
    var mapOptions = {
      zoom: 15,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      gestureHandling: 'cooperative'
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(this.map);

    let originInput = <HTMLInputElement>document.getElementById('origin-input');
    let destinationInput = <HTMLInputElement>document.getElementById('destination-input');

    let originAutocomplete = new google.maps.places.Autocomplete(originInput);
    let destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);

    originAutocomplete.setBounds(this.bounds);
    destinationAutocomplete.setBounds(this.bounds);
    // When the user has selected a valid Place from the dropdown
    originAutocomplete.addListener('place_changed', () => {
      let place = originAutocomplete.getPlace();
      if (!place || !place.geometry) {
        this.presentAlert('Invalid Origin',
        'Choose a location from the list of suggestions.');
        ga('send', 'event', 'AutocompleteFailure', 'originAutocomplete.place_changed',
        'autocomplete failure in plan trip: user didnt pick a value from dropdown');
        // If the location chosen is not valid, an error is thrown.
        // request.origin.name still holds the text that the user
        // originally typed into the field. We will set the field's value
        // back to this text.
        this.request.origin.id = null;
        originInput.value = this.request.origin.name;
        console.error('No geometry, invalid input.');
      } else if (!this.bounds.contains(place.geometry.location)) {
        this.presentAlert('Invalid Origin',
        'The PVTA does not service this location.');
        this.request.origin = {};
        console.error(`Location ${place.name} is out of bounds.`);
      } else {
        this.originPlace = place;
        this.request.origin = {
          name: place.name,
          id: place.place_id
        };
        this.request.destinationOnly = false;
      }
    });
    // When a valid destination is chosen:
    destinationAutocomplete.addListener('place_changed', () => {
      let place =  destinationAutocomplete.getPlace();
      if (!place || !place.geometry) {
        this.presentAlert('Invalid Destination',
        'Choose a location from the list of suggestions.');
        console.error('No geometry, invalid input.');
      } else if (!this.bounds.contains(place.geometry.location)) {
        this.request.destination = {};
        this.presentAlert('Invalid Destination',
        'The PVTA does not service this location.');
        console.error(`Location ${place.name} is out of bounds.`);
      } else {
        this.destinationPlace = place;
        this.request.destination = {
          name: place.name,
          id: place.place_id
        };
      }
    }, (err) => {
        ga('send', 'event', 'AutocompleteFailure', 'destinationAutocomplete.place_changed',
        'autocomplete failure in plan trip: user didnt pick a value from dropdown');
        // See comments for originAutocompleteListener method
        this.request.destination.id = null;
        destinationInput.value = this.request.destination.name;
    });
  }

  presentAlert(title: string, body: string): void {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: body,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  /* Requests a trip from Google using the trip params.
   * This function is the crown jewel of this component.
   */
   getRoute(): void {
     if (this.originDestToast) {
       this.toastSvc.noOriginOrDestinationToast();
     }
    // We need an origin and destination
    if (!this.request.origin.id || !this.request.destination.id) {
      // Clear out the search boxes for either/both of the incorrectly
      // selected fields
      if (!this.request.origin.id) {
        this.request.origin.name = '';
      }
      if (!this.request.destination.id) {
        this.request.destination.name = '';
      }
      this.originDestToast = this.toastSvc.noOriginOrDestinationToast();
      console.error('Missing an origin or destination id');
      return;
    }
    // Google won't return trips for times past.
    // Instead of throwing an error, assume the user wants
    // directions for right now
    if (!this.timeOptions[this.request.time.option].isASAP && moment(this.request.time.datetime).isBefore(moment())) {
      this.request.time.option = this.timeOptions[0].id;
      this.presentAlert('Invalid Trip Date',
      'Trips in the past are not supported. Defaulting to buses leaving now.');
      console.error('Trips in the past are not supported. Defaulting to buses leaving now.');
    }
    this.loader = this.loadingCtrl.create({
      enableBackdropDismiss: true
    });
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
        this.presentAlert('Error', 'Received invalid time');
        ga('send', 'event', 'RoutingParamsInvalid', 'PlanTripComponent.getRoute()',
        'Received invalid time params for planning a route');
        this.loader.dismiss();
        return;
      }
    }
    let directionsService = new google.maps.DirectionsService;
    /*
     * Send the official request to Google!
     */
    directionsService.route(
      {
        origin: {'placeId': this.request.origin.id},
        destination: {'placeId': this.request.destination.id},
        travelMode: google.maps.TravelMode.TRANSIT,
        transitOptions: transitOptions
      }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK ) {
        if (this.noLocationToast) {
          this.toastSvc.noLocationToast();
        }
        // Force a map redraw because it was hidden before.
        // There's an angular bug (with [hidden]) that will cause
        // the map to draw only grey after being hidden
        // unless we force a redraw TWICE after delays -_-
        setTimeout(() => {
          this.loader.dismiss();
          google.maps.event.trigger(this.map, 'resize');
          this.directionsDisplay.setDirections(response);
          this.route = response.routes[0].legs[0];
        }, 500);
        setTimeout(() => {
          google.maps.event.trigger(this.map, 'resize');
          this.directionsDisplay.setDirections(response);
          this.routeElement.nativeElement.scrollIntoView();
        }, 1000);
        ga('send', 'event', 'TripStepsRetrieved', 'PlanTripComponent.getRoute()',
        'Received steps for a planned trip!');
      } else  {
        console.log(status);
        this.presentAlert('Unable to Find Trip', `There are no scheduled buses for your trip. Error: ${status}`);
        this.loader.dismiss();
        ga('send', 'event', 'TripStepsRetrievalFailure',
        'PlanTripComponent.getRoute()', `Unable to get a route; error: ${status}`);

        // In cases of error, we set the route object that
        // otherwise contained all our data to undefined, because, well,
        // the data was bad.
        this.route = null;
      }
    });
  }

  /*
   * Saves the current trip parameters to the db
   * for display on Favorites
  */
  saveTrip(): void {
    console.log('saving trip yo');
     this.alertCtrl.create({
       title: 'Save Trip',
       message: 'Give this trip a name',
       inputs: [
         {
           name: 'name',
           placeholder: 'example: To the mall!'
         },
       ],
       buttons: [
         {
           text: 'Cancel',
           handler: data => {
             console.log('Cancel clicked');
           }
         },
         {
           text: 'Save',
           handler: data => {
             console.log('data', data);
             this.request.name = data.name;
             console.log('Saved clicked');
             this.tripService.saveTrip(this.request);
             ga('send', 'event', 'TripSaveSuccessful', 'PlanTripComponent.saveTrip()',
             'Saved a trip to favorites!');
           }
         }
       ]
     }).present();
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
