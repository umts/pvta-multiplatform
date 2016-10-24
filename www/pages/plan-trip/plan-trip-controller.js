angular.module('pvta.controllers').controller('PlanTripController', function ($scope, $location, $q, $cordovaGeolocation, $ionicLoading, $ionicPopup, $ionicScrollDelegate, NearestStop, Trips, $timeout, ionicDatePicker, ionicTimePicker) {
  ga('set', 'page', '/plan-trip.html');
  ga('send', 'pageview');
  defaultMapCenter = new google.maps.LatLng(42.3918143, -72.5291417);//Coords for UMass Campus Center
  swBound = new google.maps.LatLng(41.93335, -72.85809);
  neBound = new google.maps.LatLng(42.51138, -72.20302);

  $scope.bounds = new google.maps.LatLngBounds(swBound, neBound);
  //takes in a value for ASAP, and updates the page accordingly
  $scope.updateASAP = function (asap) {
    if (asap !== undefined) {
      $scope.params.time.asap = asap;
    }
    if ($scope.params.time.asap === true) {
      $scope.params.time.type = 'departure';
    }
  };
  /**
   * Checks whether we're trying to
   * get directions starting at the
   * current location.  If so, get it.
   * Otherwise, clear out the values
   * for origin so the user knows to type something.
  */
  $scope.updateOrigin = function () {
    if ($scope.params.destinationOnly) {
      loadLocation();
    } else {
      $scope.params.origin.name = '';
      $scope.params.origin.id = '';
    }
  };

 //Loads the user's location and updates the origin
  var loadLocation = function () {
    var deferred = $q.defer();
    var options = {timeout: 5000, enableHighAccuracy: true};
    $ionicLoading.show();

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
      $ionicLoading.hide();
      $scope.noLocation = false;
      new google.maps.Geocoder().geocode({
        'latLng': new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
      }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            $scope.params.origin = {
              name: results[1].formatted_address,
              id: results[1].place_id
            };
            deferred.resolve();
            $scope.$apply();
          }
        }
      });
    }, function (err) {
      // Tell Google Analytics that a user doesn't have location
      ga('send', 'event', 'LocationFailure', 'PlanTripConsoller.$cordovaGeolocation.getCurrentPosition', 'location failed on Plan Trip; error: '+ err.msg);
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
        $scope.params.destinationOnly = false;
      }, 1000);
      console.log('unable to get location ' + err.message);
    });

    return deferred.promise;
  };

  //Called when this page is opened, and either a loaded trip has been queued
  //or there are no current existing parameters. Also called as a result of the
  //newTrip method. Constructs the map, and then sets $scope.params as either default
  //or loaded parameters
  var reload = function () {
    constructMap(defaultMapCenter);
    // All dates on this page are in Unix Epoch
    currentDate = new Date();
    $scope.params = {
      name: 'New Trip',
      time: {
        datetime: currentDate,
        type: 'departure',
        asap: true
      },
      origin: {},
      destination: {},
      destinationOnly: true
    };
    // If we loaded a trip (user came via
    // saved trip on My Buses), pull out
    // its details and display them.
    if (loadedTrip !== null) {
      $scope.loaded = true;
      $scope.params = loadedTrip;
      $scope.params.time = loadedTrip.time;
      loadedTrip = null;
      if ($scope.params.destinationOnly) {
        loadLocation().then(function () {
          $scope.getRoute();
        });
      }
      else {
        $scope.getRoute();
      }
      ga('send', 'event', 'TripLoaded', 'PlanTripController.reload()', 'User has navigated to Plan Trip using a saved Trip.');
    }
    else {
      $scope.loaded = false;
      loadLocation();
    }
    $scope.updateASAP();
  };

  $scope.$on('$ionicView.enter', function () {
    loadedTrip = Trips.pop();
    //
    $scope.selectedTimeOption = $scope.timeOptions[0];
    if (loadedTrip !== null || !$scope.params)//reload if either a trip is being loaded or if this page has not yet been loaded
      reload();
  });

  var invalidLocationPopup = function () {
    ga('send', 'event', 'InvalidLocation', 'PlanTripController.invalidLocationPopup()', 'Attempted to plan trip to/from location PVTA does not service');
    $ionicPopup.alert({
      title: 'Invalid Location',
      template: 'PVTA does not service this location.'
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
    originAutocomplete.setBounds($scope.bounds);
    destinationAutocomplete.setBounds($scope.bounds);

    originAutocomplete.addListener('place_changed', function () {
      $scope.params.destinationOnly = false;
      var place = originAutocomplete.getPlace();
      if (!place.geometry) {
        console.error('Place has no geometry.');
        return;
      }
      if ($scope.bounds.contains(place.geometry.location)) {
        expandViewportToFitPlace($scope.map, place);
        $scope.params.origin.id = place.place_id;
        $scope.params.origin.name = place.name;
        $scope.$apply();
      } else {
        $scope.params.origin.id = null;
        originInput.value = $scope.params.origin.name;
        invalidLocationPopup();
      }
    });

    destinationAutocomplete.addListener('place_changed', function () {
      var place = destinationAutocomplete.getPlace();
      if (!place.geometry) {
        console.error('Place has no geometry.');
        return;
      }
      if ($scope.bounds.contains(place.geometry.location)) {
        expandViewportToFitPlace($scope.map, place);
        $scope.params.destination.id = place.place_id;
        $scope.params.destination.name = place.name;
        $scope.$apply();
      }
      else {
        $scope.params.destination.id = null;
        destinationInput.value = $scope.params.destination.name;
        invalidLocationPopup();
      }
    });
  }


  function expandViewportToFitPlace (map, place) {
    if (place.geometry.viewpoint) {
      map.fitBounds(place.geometry.viewpoint);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  }
  

  /*
   *
   * Uses all the trip params and
   * requests a trip from Google.
   */
  $scope.getRoute = function () {
    // We need an origin and destination
    if (!$scope.params.origin.id || !$scope.params.destination.id) {
      return;
    }

    // Google won't return trips for times past.
    // Instead of throwing an error, assume the user wants
    // directions for right now.
    if ($scope.params.time.datetime < Date.now()) {
      $scope.updateASAP(true);
    }

    $ionicLoading.show({
      template: 'Routing..'
    });

    transitOptions = {
      modes: [google.maps.TransitMode.BUS]
    };

  if ($scope.params.time.asap !== true) {
      if ($scope.params.time.type === 'departure') {
        transitOptions['departureTime'] = $scope.params.time.datetime;
      }
      else if ($scope.params.time.type === 'arrival') {
        transitOptions['arrivalTime'] = $scope.params.time.datetime;
      }
      else {
        console.error("Determining route for Plan Trip failed due to unexpected input. Expected 'arrival' or 'departure', received" + params.time.type);
      }
    }

    directionsService = new google.maps.DirectionsService;
    directionsService.route({
      origin: {'placeId': $scope.params.origin.id},
      destination: {'placeId': $scope.params.destination.id},
      travelMode: google.maps.TravelMode.TRANSIT,
      transitOptions: transitOptions
    }, function (response, status) {
      $ionicLoading.hide();

      if (status === google.maps.DirectionsStatus.OK) {
        console.log(response);
        $scope.directionsDisplay.setDirections(response);
        $scope.leg = response.routes[0].legs[0];
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
            title: 'Unable to Find a Trip',
            template: 'There are no scheduled buses that work for your trip.\nThis failure has a status code of: ' + status
          }
        );
        ga('send', 'event', 'TripStepsRetrievalFailure', 'PlanTripController.$scope.getRoute()', 'Unable to get a route; error: ' + status);
        // In cases of error, we set the route object that
        // otherwise contained all our data to undefined, because, well,
        // the data was bad.
        $scope.leg = undefined;
      }
     // callback(route);
    }, function(err) {
      $scope.leg = undefined;
      $ionicLoading.hide();
      console.log('Error routing: ' + err);
      ga('send', 'event', 'TripStepsRoutingFailure', 'PlanTripController.$scope.getRoute()', 'Trip Factory unable to get a route due to some error: ' + err);
    });
};
 // };

  var saveSuccessful = function () {
    $ionicPopup.alert({
      title: 'Save Successful!',
      template: 'This trip can be accessed from My Buses.'
    });
    ga('send', 'event', 'TripSaveSuccessful', 'PlanTripController.saveSuccessful()', 'Saved a trip to favorites!');
  };

  /**
   * Saves the current trip parameters to the db
   * for display on My Buses
   */
  $scope.saveTrip = function () {
    var prevName = $scope.params.name;
    if (!$scope.loaded) {
      $scope.params.name = '';//Clears the name instead of 'New Trip'
    }
    $ionicPopup.show({
      template: '<input type="text" ng-model="params.name">',
      title: 'Trip Name',
      subTitle: 'Give this trip a name.',
      scope: $scope,
      buttons: [
    {text: 'Cancel',
      onTap: function () {
        $scope.params.name = prevName;
      }},
      {text: '<b>OK</b>',
        type: 'button-positive',
      onTap: function () {
        if ($scope.loaded) {
          Trips.set($scope.params);
        }
        else {
          Trips.add($scope.params);
        }
        //the current trip is now considered loaded onto the page
        $scope.loaded = true;
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
      template: '<div style=\'text-align:center\'>Close current trip?</div>'
    }).then(function (res) {
      if (res) {
        $scope.loaded = false;
        $scope.route.origin = null;
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
      $scope.params.time.datetime.setHours(selectedTime.getUTCHours());
      $scope.params.time.datetime.setMinutes(selectedTime.getUTCMinutes());
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
      $scope.params.time.datetime.setDate(date.getDate());
      $scope.params.time.datetime.setMonth(date.getMonth());
      $scope.params.time.datetime.setFullYear(date.getFullYear());
      ga('send', 'event', 'TripDateChosen', 'PlanTripController.onDateChosen()', 'Custom date for trip was set!');
    }
    else {
      var error = 'Received undefined date from datepicker.';
      console.error(error)
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
      setLabel: 'OK',
      closeLabel: 'Cancel',
      mondayFirst: false,
      showTodayButton: true,
      closeOnSelect: true
    };
    ionicDatePicker.openDatePicker(datePickerConfig);
  };

  /*
   * Sets the trip params object to match
   * the values chosen in the UI.
   * Uses the global variable bound to a
   * <select>.
   */
  $scope.setTimeOption = function () {
    var selectedOption = $scope.selectedTimeOption;
    $scope.params.time.asap = selectedOption.isASAP;
    $scope.params.time.type = selectedOption.type;
  };

  $scope.goToStop = function(loc) {
    NearestStop.get({latitude: loc.lat(), longitude: loc.lng()}).$promise.then(function(stop) {
      $location.path('app/stops/' + stop.StopId);
    });
  }

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
      title: 'Arriving At...',
      type: 'arrival',
      isASAP: false,
      id: 2
    }
  ];
});
