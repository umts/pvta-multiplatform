angular.module('pvta.controllers').controller('PlanTripController', function ($scope, $location, $q, $interval, $cordovaGeolocation, $ionicLoading, $cordovaDatePicker, $ionicPopup, $ionicScrollDelegate, Trips, $timeout) {
  ga('set', 'page', '/plan-trip.html');
  ga('send', 'pageview');
  defaultMapCenter = new google.maps.LatLng(42.3918143, -72.5291417);//Coords for UMass Campus Center
  swBound = new google.maps.LatLng(41.93335, -72.85809);
  neBound = new google.maps.LatLng(42.51138, -72.20302);

  $scope.bounds = new google.maps.LatLngBounds(swBound, neBound);

  //timer which is set to run if the user specifies ASAP
  startTimer = function () {
    timer = $interval(function () {
      if (!$scope.timerPaused) {
        $scope.params.time.datetime = Date.now();
      }
    }, 1000);
  };

  //takes in a value for ASAP, and updates the page accordingly
  $scope.updateASAP = function (asap) {
    if (asap !== undefined)
      $scope.params.time.asap = asap;
    if ($scope.params.time.asap) {
      $scope.params.time.type = 'departure';
      $scope.timerPaused = false;
    }
    else {
      $scope.timerPaused = true;
    }
  };

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

    if (loadedTrip !== null) {
      $scope.loaded = true;
      $scope.params = loadedTrip;
      loadedTrip = null;
      if ($scope.params.destinationOnly) {
        loadLocation().then(function () {
          $scope.getRoute();
        });
      }
      else $scope.getRoute();
    }
    else {
      $scope.loaded = false;
      loadLocation();
    }

    $scope.updateASAP();
  };

  $scope.$on('$ionicView.enter', function () {
    loadedTrip = Trips.pop();
    startTimer();
    if (loadedTrip !== null || !$scope.params)//reload if either a trip is being loaded or if this page has not yet been loaded
      reload();
  });

  $scope.$on('$ionicView.leave', function () {
    $interval.cancel(timer);
  });


  var invalidLocationPopup = function () {
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
        console.log('Place has no geometry.');
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
        console.log('Place has no geometry.');
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


  $scope.getRoute = function () {
    if (!$scope.params.origin.id || !$scope.params.destination.id) {
      return;
    }

    $scope.route = {
      directions: [],
      arrivalTime: null,
      departureTime: null,
      origin: null,
      destination: null
    };

    if ($scope.params.time.datetime < Date.now()) {//directions will fail if given a previous time
      $scope.updateASAP(true);
    }
    $ionicLoading.show({
      template: 'Routing..'
    });

    Trips.route($scope.params, $scope.directionsDisplay, function (data) {
      $ionicLoading.hide();
      $scope.route = data;
      if ($scope.route.status === google.maps.DirectionsStatus.OK) {
        Trips.generateDirections(function (data) {
          $scope.route.directions = data;
          $scope.$apply();
          $scope.scrollTo('route');
        });
      }
      else
       $ionicPopup.alert({
         title: 'Request Failed',
         template: 'Directions request failed due to ' + $scope.route.status
       });
    }, function (err) {
      $ionicLoading.hide();
      console.log('Error routing: ' + err);
    });
  };

  var saveSuccessful = function () {
    $ionicPopup.alert({
      title: 'Save Successful!',
      template: 'This trip can be accessed from My Buses.'
    });
  };

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
        $scope.loaded = true;//the current trip is now considered loaded onto the page
        saveSuccessful();}
      }]
    });
  };

  //Supply anchor the div to scroll to, used on this page to view directions
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

  // This method allows for location selection on google typeahead on mobile devices
  $scope.disableTap = function () {
    container = document.getElementsByClassName('pac-container');
    // disable ionic data tab
    angular.element(container).attr('data-tap-disabled', 'true');
    //         // leave input field if google-address-entry is selected
    angular.element(container).on('click', function () {
      document.getElementById('origin-input').blur();
      document.getElementById('destination-input').blur();
    });
  };

});
