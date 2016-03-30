angular.module('pvta.controllers').controller('PlanTripController', function ($scope, $location, $cordovaGeolocation, $cordovaDatePicker, $ionicPopup, $ionicScrollDelegate, Trips) {

  defaultMapCenter = new google.maps.LatLng(42.3918143, -72.5291417);//Coords for UMass Campus Center
  swBound = new google.maps.LatLng(41.93335, -72.85809);
  neBound = new google.maps.LatLng(42.51138, -72.20302);

  $scope.bounds = new google.maps.LatLngBounds(swBound, neBound);

  var reload = function () {
    currentDate = new Date();
    $scope.params = {
      name: 'New Trip',
      time: {
        datetime: currentDate,
        type: 'departure',
        asap: true
      },
      origin: {},
      destination: {}
    };
    var loadedTrip = Trips.pop();
    var options = {timeout: 5000, enableHighAccuracy: true};

    if (loadedTrip !== null) {
      $scope.loaded = true;
      $scope.params = loadedTrip;
    }
    else {
      $scope.loaded = false;
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        new google.maps.Geocoder().geocode({
          'latLng': new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        }, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              $scope.params.origin = {
            name: results[1].formatted_address,
            id: results[1].place_id
          };
              $scope.$apply();
            }
          }
        });
      });
    }
    constructMap(defaultMapCenter);
  };

  $scope.$on('$ionicView.enter', function () {
    reload();
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


  $scope.route = function () {
    $scope.route.steps = [];
    $scope.route.stepLinks = [];
    $scope.route.arrivalTime = null;
    $scope.route.departureTime = null;
    $scope.route.origin = null;
    $scope.route.destination = null;

    if (!$scope.params.origin.id || !$scope.params.destination.id) {
      return;
    }
    transitOptions = {
      modes: [google.maps.TransitMode.BUS]
    };
    if ($scope.params.time.type === 'departure') {
      transitOptions['departureTime'] = $scope.params.time.datetime;
    }
    else {
      transitOptions['arrivalTime'] = $scope.params.time.datetime;
    }
    $scope.directionsService.route({
      origin: {'placeId': $scope.params.origin.id},
      destination: {'placeId': $scope.params.destination.id},
      travelMode: google.maps.TravelMode.TRANSIT,
      transitOptions: transitOptions
    }, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        $scope.directionsDisplay.setDirections(response);
        route = response.routes[0].legs[0];
        createStepList(response);
        $scope.route.arrivalTime = route['arrivalTime']['text'];
        $scope.route.departureTime = route['departureTime']['text'];
        $scope.route.origin = route['start_address'];
        $scope.route.destination = route['end_address'];
        $scope.$apply();
        $scope.scrollTo('route');
      }
      else {
        $ionicPopup.alert({
          title: 'Request Failed',
          template: 'Directions request failed due to ' + status
        });
      }
    });
  };

  function createStepList (response) {
    for (var i = 0; i < response.routes[0].legs[0].steps.length; i++) {
      var step = response.routes[0].legs[0].steps[i];

      if (step['travel_mode'] === 'TRANSIT') {
        var lineName;
        if (step['transit']['line']['short_name']) {
          lineName = step['transit']['line']['short_name'];
        }
        else {
          lineName = step['transit']['line']['name'];
        }
        var departInstruction = 'Take ' + step['transit']['line']['vehicle']['name'] + ' ' + lineName + ' at ' + step['transit']['departureTime']['text'] + '. ' + step['instructions'];
        var arriveInstruction = 'Arrive at ' + step['transit']['arrival_stop']['name'] + ' ' + step['transit']['arrivalTime']['text'];
        $scope.route.steps.push(departInstruction);
        $scope.route.steps.push(arriveInstruction);
        if (step['transit']['line']['agencies'][0]['name'] === 'PVTA') {
          linkToStop(step['transit']['departure_stop']['name']);
          linkToStop(step['transit']['arrival_stop']['name']);
        }
        else {
          $scope.route.stepLinks.concat(['', '']);
        }


      }
      else {
        $scope.route.steps.push(step['instructions']);
        $scope.route.stepLinks.push('');
      }
    }
  }

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
    });
  };

});
