angular.module('pvta.controllers').controller('PlanTripController', function ($scope, $location, $state, $q, $cordovaGeolocation, $ionicLoading, $ionicPopup, $ionicScrollDelegate, NearestStop, Trips, $timeout, ionicDatePicker, ionicTimePicker, Map, ionicLoadingConfig) {
  ga('set', 'page', '/plan-trip.html');
  ga('send', 'pageview');
  defaultMapCenter = new google.maps.LatLng(42.3918143, -72.5291417);//Coords for UMass Campus Center

  // These coordinates draw a rectangle around all PVTA-serviced area. Used to restrict requested locations to only PVTALand
  swBound = new google.maps.LatLng(41.93335, -72.85809);
  neBound = new google.maps.LatLng(42.51138, -72.20302);
  bounds = new google.maps.LatLngBounds(swBound, neBound);

  /**
   * Checks whether we're trying to
   * get directions starting at the
   * current location.  If so, get it.
   * Otherwise, clear out the values
   * for origin so the user knows to type something.
  */
  $scope.updateOrigin = function () {
    if ($scope.request.destinationOnly) {
      loadLocation();
    } else {
      $scope.request.origin = {};
    }
  };

 //Loads the user's location and updates the origin
  var loadLocation = function () {
    var deferred = $q.defer();
    var options = {timeout: 5000, enableHighAccuracy: true};
    $ionicLoading.show(ionicLoadingConfig);

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
      $ionicLoading.hide();

      //geocode current position to retrieve its corresponding Google Maps ID
      new google.maps.Geocoder().geocode({
        'latLng': new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
      }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            $scope.request.origin = {
              name: results[1].formatted_address,
              id: results[1].place_id
            };
            if ($scope.request.destination.name) {
              $scope.request.name = $scope.request.destination.name;
            }
            deferred.resolve();
            $scope.$apply();
          }
        }
      });
    }, function (err) {
      Map.showInsecureOriginLocationPopup(err);
      // Tell Google Analytics that a user doesn't have location
      ga('send', 'event', 'LocationFailure', 'PlanTripConsoller.$cordovaGeolocation.getCurrentPosition', 'location failed on Plan Trip; error: ' + err.message);
      // When getting location fails, this callback fires
      $scope.noLocation = true;
      /* When getting location fails immediately, $ionicLoading.hide()
       * is never called (or the page refuses to redraw), so
       * we add a 1 second delay as a workaround.
       *
       * We also set the checkbox state after the delay, but solely
       * for user feedback (it otherwise would never change when clicked on)
       */
      $timeout(function () {
        $ionicLoading.hide();
        $scope.request.destinationOnly = false;
      }, 1000);
      console.log('unable to get location ' + err.message);
    });

    return deferred.promise;
  };

  //Called when this page is opened, and either a loaded trip has been queued
  //or there are no current existing parameters. Also called as a result of the
  //newTrip method. Constructs the map, and then sets $scope.request as either default
  //or loaded parameters
  var reload = function () {
    $scope.scrollTo('input');
    constructMap(defaultMapCenter);
    $scope.noLocation = false;
    // If we loaded a trip (user came via
    // saved trip on My Buses), pull out
    // its details and display them.
    if (loadedTrip) {
      $scope.request = loadedTrip;
      $scope.request.time.option = $scope.timeOptions[$scope.request.time.option.id];
      loadedTrip = null;

      //Fix the time of the saved trip. If the datetime is in the future, keep it
      //If the datetime is in the past, keep the time and update the date to today's.
      if ($scope.request.time.datetime < Date.now()) {
        $scope.request.time.datetime.setDate(new Date().getDate());
        $scope.request.time.datetime.setMonth(new Date().getMonth());
      }

      //If the request has destinationOnly -> true, that implies
      //that the user originally used Location Services to plan
      //their trip. We assume that the user again wants to
      // use their current location as the trip's origin.
      // If destinationOnly is false, then we use the origin that
      // was saved with the trip.
      if ($scope.request.destinationOnly) {
        $scope.request.origin = {};
        loadLocation().then(function () {
          $scope.getRoute();
        });
      }
      else {
        $scope.getRoute();
      }

      ga('send', 'event', 'TripLoaded', 'PlanTripController.reload()', 'User has navigated to Plan Trip using a saved Trip.');
    }
    //There is no loaded trip, so load the page with default (empty) parameters
    //And attempt to use current location as trip's origin
    else {
      $scope.request = {
        name: 'New Trip',
        time: {
          datetime: new Date(),
          option: $scope.timeOptions[0]
        },
        origin: {},
        destination: {},
        destinationOnly: true,
        saved: false
      };
      loadLocation();
    }
  };

  $scope.$on('$ionicView.enter', function () {
    loadedTrip = Trips.pop();
    if (loadedTrip || !$scope.request)//reload if either a trip is being loaded or if this page has not yet been loaded
      reload();
  });

  var invalidLocationPopup = function (template) {
    $ionicPopup.alert({
      title: 'Invalid Location',
      template: template
    });
  };

  function constructMap (latLng) {
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById('directions-map'), mapOptions);


    $scope.directionsDisplay = new google.maps.DirectionsRenderer;

    $scope.directionsDisplay.setMap($scope.map);

    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');

    var originAutocomplete = new google.maps.places.Autocomplete(originInput);
    var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
    originAutocomplete.setBounds(bounds);
    destinationAutocomplete.setBounds(bounds);


    originAutocomplete.addListener('place_changed', function () {
      mapLocation(originAutocomplete.getPlace(), function (place) {
        $scope.request.origin = {
          name: place.name,
          id: place.place_id
        };
        $scope.request.destinationOnly = false;
        //Name the trip if there is a destination: ORIGIN to DESTINATION
        if ($scope.request.destination.name) {
          $scope.request.name = place.name + ' to ' + $scope.request.destination.name;
        }
        $scope.$apply();
      }, function (err) {
        ga('send', 'event', 'AutocompleteFailure', 'originAutocomplete.place_changed', 'autocomplete failure in plan trip: ' + err);
        //If the location chosen is not valid, an error is thrown.
        //$scope.request.origin.name still holds the text that the user
        //originally typed into the field. We will set the field's value
        //back to this text
        $scope.request.origin.id = null;
        originInput.value = $scope.request.origin.name;
      });
    });

    destinationAutocomplete.addListener('place_changed', function () {
      mapLocation(destinationAutocomplete.getPlace(), function (place) {
        $scope.request.destination = {
          name: place.name,
          id: place.place_id
        };
        //Name the trip: ORIGIN to DESTINATION if not destinationOnly, otherwise just DESTINATION
        if ($scope.request.destinationOnly || !$scope.request.origin.name) {
          $scope.request.name = place.name;
        } else {
          $scope.request.name = $scope.request.origin.name + ' to ' + place.name;
        }
        $scope.$apply();
      }, function (err) {
        ga('send', 'event', 'AutocompleteFailure', 'destinationAutocomplete.place_changed', 'autocomplete failure in plan trip: ' + err);
        //See comments for originAutocompleteListener method
        $scope.request.destination.id = null;
        destinationInput.value = $scope.request.destination.name;
      });
    });
  }

  function mapLocation (place, success, error) {
    if (!place.geometry) {
      invalidLocationPopup('Choose a location from the list of suggestions.');
      error('No geometry, invalid input.');
    }
    else if (!bounds.contains(place.geometry.location)) {
      invalidLocationPopup('PVTA does not service this location.');
      error('Location ' + place.name + ' is out of bounds. ID: ' + place.id);
    } else {
      //Fit the location on the map
      if (place.geometry.viewpoint) {
        $scope.map.fitBounds(place.geometry.viewpoint);
      } else {
        $scope.map.setCenter(place.geometry.location);
        $scope.map.setZoom(17);
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
  $scope.getRoute = function () {
    // We need an origin and destination
    if (!$scope.request.origin.id || !$scope.request.destination.id) {
      return;
    }

    // Google won't return trips for times past.
    // Instead of throwing an error, assume the user wants
    // directions for right now.
    if (!$scope.request.time.option.isASAP && $scope.request.time.datetime < Date.now()) {
      $scope.request.time.option = $scope.timeOptions[0];
      $ionicPopup.alert({
        title: 'Invalid Trip Date',
        template: 'Trips in the past are not supported. Defaulting to buses leaving now.'
      });
    }

    $ionicLoading.show({
      template: 'Routing..',
      timeout: 5000
    });

    transitOptions = {
      modes: [google.maps.TransitMode.BUS]
    };

    if ($scope.request.time.option.isASAP !== true) {
      if ($scope.request.time.option.type === 'departure') {
        transitOptions['departureTime'] = $scope.request.time.datetime;
      }
      else if ($scope.request.time.option.type === 'arrival') {
        transitOptions['arrivalTime'] = $scope.request.time.datetime;
      }
      else {
        console.error('Determining route for Plan Trip failed due to unexpected input. Expected \'arrival\' or \'departure\', received' + params.time.option);
        ga('send', 'event', 'RoutingParamsInvalid', 'PlanTripController.getRoute()', 'Received invalid time params for planning a route');
        return;
      }
    }

    directionsService = new google.maps.DirectionsService;
    directionsService.route({
      origin: {'placeId': $scope.request.origin.id},
      destination: {'placeId': $scope.request.destination.id},
      travelMode: google.maps.TravelMode.TRANSIT,
      transitOptions: transitOptions
    }, function (response, status) {
      console.log(response);
      $ionicLoading.hide();

      if (status === google.maps.DirectionsStatus.OK && confirmValidRoute(response.routes[0])) {
        $scope.directionsDisplay.setDirections(response);
        $scope.route = response.routes[0].legs[0];
        $scope.$apply();
        $scope.scrollTo('route');
        // Force a map redraw because it was hidden before.
        // There's an angular bug with ng-show that will cause
        // the map to draw only grey after being hidden
        // unless we force a redraw.
        google.maps.event.trigger($scope.map, 'resize');
        ga('send', 'event', 'TripStepsRetrieved', 'PlanTripController.getRoute()', 'Received steps for a planned trip!');
      } else  {
        console.log(status);
        $ionicPopup.alert(
          {
            title: 'Unable to Find Trip',
            template: 'There are no scheduled buses for your trip.<br>Status Code: ' + status
          }
        );
        ga('send', 'event', 'TripStepsRetrievalFailure', 'PlanTripController.$scope.getRoute()', 'Unable to get a route; error: ' + status);
        // In cases of error, we set the route object that
        // otherwise contained all our data to undefined, because, well,
        // the data was bad.
        $scope.route = undefined;
      }
    }, function (err) {
      $scope.route = undefined;
      $ionicLoading.hide();
      console.log('Error routing: ' + err);
      ga('send', 'event', 'TripStepsRoutingFailure', 'PlanTripController.$scope.getRoute()', 'Trip Factory unable to get a route due to some error: ' + err);
    });
  };

  function confirmValidRoute (route) {
    return !(route.legs[0].steps.length === 1 && route.legs[0].steps[0]['travel_mode'] === 'WALKING');
  }

  var saveSuccessful = function () {
    $ionicPopup.alert({
      title: 'Save Successful!',
      template: '<p role="alert" aria-live="assertive">This trip can be accessed from My Buses.</p>'
    });
    ga('send', 'event', 'TripSaveSuccessful', 'PlanTripController.saveSuccessful()', 'Saved a trip to favorites!');
  };

  /**
   * Saves the current trip parameters to the db
   * for display on My Buses
   */
  $scope.saveTrip = function () {
    var prevName = $scope.request.name;
    $ionicPopup.show({
      template: '<input type="text" role="dialog" placeholder="Give this trip a name" ng-model="request.name" aria-live="assertive">',
      title: 'Trip Name',
      scope: $scope,
      buttons: [
    {text: 'Cancel',
      onTap: function () {
        $scope.request.name = prevName;
      }},
      {text: '<b>OK</b>',
        type: 'button-positive',
      onTap: function () {
        if ($scope.request.saved) {
          Trips.set($scope.request);
        }
        else {
          $scope.request.saved = true;
          Trips.add($scope.request);
        }
        saveSuccessful();}
      }]
    });
  };

  /*
   * Scrolls the page to a specific subsection.
   * @param anchor: the ID of a div we wish to scroll to
   */
  $scope.scrollTo = function (anchor) {
    $location.hash(anchor);
    $ionicScrollDelegate.anchorScroll(true);
  };

  // After confirmation, reloads page with an empty trip
  $scope.newTrip = function () {
    $ionicPopup.confirm({
      title: 'New Trip',
      template: '<div aria-live="assertive" style=\'text-align:center\'>Close current trip?</div>'
    }).then(function (res) {
      if (res) {
        loadedTrip = null;
        $scope.route = null;
        reload();
      }
    });
  };

  /* Allows for location selection on google
   * typeahead on mobile devices
   */
  $scope.disableTap = function () {
    container = document.getElementsByClassName('pac-container');
    // disable ionic data tap
    angular.element(container).attr('data-tap-disabled', 'true');
    angular.element(container).attr('id', 'places');
    // leave input field if google-address-entry is selected
    angular.element(container).on('click', function () {
      document.getElementById('origin-input').blur();
      document.getElementById('destination-input').blur();
    });
  };

  /*
   * Callback function for when the user uses
   * the time picker to select a time.
   * Sets the trip param's time property
   * so we can request a trip at a specific time.
   * @param: time, an int in Unix Epoch
   */
  function onTimeChosen (time) {
    if (typeof (time) === 'undefined') {
      var error = 'Received undefined time from timepicker.';
      console.error(error);
      ga('send', 'event', 'TimePickerReturnedBadValue', 'PlanTripController.onTimeChosen()', 'Received undefined time from timepicker.');
    } else {
      // Make the input into a Javascript date object
      var selectedTime = new Date(time * 1000);
      // Pull the hours and minutes; we don't care about
      // anything else
      $scope.request.time.datetime.setHours(selectedTime.getUTCHours());
      $scope.request.time.datetime.setMinutes(selectedTime.getUTCMinutes());
      ga('send', 'event', 'TripTimeChosen', 'PlanTripController.onTimeChosen()', 'Custom time for trip was set!');
    }
  }
  /*
   * Callback function for when user
   * has selected a date in the datepicker.
   * Sets the trip params date property
   * so we can request trips on a specific date
   */
  function onDateChosen (date) {
    if (date) {
      date = new Date(date);
      $scope.request.time.datetime.setDate(date.getDate());
      $scope.request.time.datetime.setMonth(date.getMonth());
      $scope.request.time.datetime.setFullYear(date.getFullYear());
      ga('send', 'event', 'TripDateChosen', 'PlanTripController.onDateChosen()', 'Custom date for trip was set!');
    }
    else {
      var error = 'Received undefined date from datepicker.';
      console.error(error);
      ga('send', 'event', 'DatePickerReturnedBadValue', 'PlanTripController.onDateChosen()', error);
    }
  }

  /*
   * Wrapper function for opening the
   * time picker in the UI.
   */
  $scope.openTimePicker = function () {
    var timePickerConfig = {
      callback: onTimeChosen,
      inputTime: $scope.request.time.datetime.getHours() * 60 * 60 + $scope.request.time.datetime.getMinutes() * 60,
      format: 12,         //Optional
      step: 1,           //Optional
    };
    ionicTimePicker.openTimePicker(timePickerConfig);
  };

  /*
   * Wrapper function to show the datepicker
   */
  $scope.openDatePicker = function () {
    // Configure the datepicker before showing it
    var datePickerConfig = {
      callback: onDateChosen,
      from: new Date(), //Optional
      to: new Date().setYear(new Date().getFullYear() + 1),
      inputDate: $scope.request.time.datetime ? $scope.request.time.datetime : new Date(),
      closeLabel: 'Cancel',
      mondayFirst: false,
    };
    ionicDatePicker.openDatePicker(datePickerConfig);
  };

  $scope.goToStop = function (loc) {
    NearestStop.get({latitude: loc.lat(), longitude: loc.lng()}, function (stop) {
      $state.go('app.stop', {stopId: stop.StopId});
    });
  };

  /*
   * List of the different types
   * of times that we can request trips.
   * Each type has a name that we
   * use in the UI and a few
   * properties for us.
   */
  $scope.timeOptions = [
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
});
