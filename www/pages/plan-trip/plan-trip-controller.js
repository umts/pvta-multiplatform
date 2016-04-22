angular.module('pvta.controllers').controller('PlanTripController', function ($scope, $location, $q, $interval, $cordovaGeolocation, $ionicLoading, $cordovaDatePicker, $ionicPopup, $ionicScrollDelegate, Trips, GoogleDirections) {

  defaultMapCenter = new google.maps.LatLng(42.3918143, -72.5291417);//Coords for UMass Campus Center
  swBound = new google.maps.LatLng(41.93335, -72.85809);
  neBound = new google.maps.LatLng(42.51138, -72.20302);

  $scope.bounds = new google.maps.LatLngBounds(swBound, neBound);
  startTimer = function () {
    $scope.timer = $interval(function () {
      $scope.params.time.datetime = Date.now();
    }, 1000);
  };

  $scope.updateASAP = function (asap) {
    if (asap !== undefined)
      $scope.params.time.asap = asap;
    if ($scope.params.time.asap) {
      $scope.params.time.type = 'departure';
      startTimer();
    }
    else if ($scope.timer !== undefined){
      $interval.cancel($scope.timer);
    }
  };

  $scope.updateOrigin = function() {
    if ($scope.params.destination_only) {
      loadLocation();
    } else {
      $scope.params.origin.name = '';
      $scope.params.origin.id = '';
    }
  }
  
  var loadLocation = function() {
    var deferred = $q.defer();
    var options = {timeout: 5000, enableHighAccuracy: true};
    $ionicLoading.show({
      template: 'Getting location...'
    });
    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
      $ionicLoading.hide();
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
    }, function(err) {
      $ionicLoading.hide();
    });
    return deferred.promise;
  };

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
      destination_only: true 
    };

    if (loadedTrip !== null) {
      $scope.loaded = true;
      $scope.params = loadedTrip;
      loadedTrip = null;
      if ($scope.params.destination_only) {
        loadLocation().then(function() {
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

  $scope.$on('$ionicView.enter', function() {
    loadedTrip = Trips.pop();
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


    $scope.directionsService = new google.maps.DirectionsService;
    $scope.directionsDisplay = new google.maps.DirectionsRenderer;

    $scope.directionsDisplay.setMap($scope.map);

    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');

    var originAutocomplete = new google.maps.places.Autocomplete(originInput);
    var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
    originAutocomplete.setBounds($scope.bounds);
    destinationAutocomplete.setBounds($scope.bounds);

    originAutocomplete.addListener('place_changed', function () {
      $scope.params.destination_only = false;
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
    $scope.route = {
      directions: {},
      arrivalTime: null,
      departureTime: null,
      origin: null,
      destination: null
    }
    if (!$scope.params.origin.id || !$scope.params.destination.id) {
      return;
    }
    if ($scope.params.time.datetime < Date.now()){
      $scope.updateASAP(true);
    }
    $ionicLoading.show({
      template: 'Routing..'
    });
    GoogleDirections.route($scope.params, $scope.directionsDisplay, function(data) { 
      $ionicLoading.hide();
      $scope.route = data; 
      if ($scope.route.status === google.maps.DirectionsStatus.OK) {
        GoogleDirections.generateDirections(function(data) { 
          $scope.route.directions = data;
          $scope.$apply();
          $scope.scrollTo('route');
        });
      }
      else
       $ionicPopup.alert({
        title: 'Request Failed',
        template: 'Directions request failed due to ' + status
      });
    }, function(err){
      console.log("no dude");
    });
  };

  function linkToStop (stop) {
    stop = stop.split(' ');
    stop = stop[stop.length - 1];
    stop = stop.substring(1, stop.length - 1);
    $scope.route.stepLinks.push('#/app/stops/' + stop);

  }

  var saveSuccessful = function () {$ionicPopup.alert({
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

  $scope.scrollTo = function (anchor) {
    $location.hash(anchor);
    $ionicScrollDelegate.anchorScroll(true);
  };

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
