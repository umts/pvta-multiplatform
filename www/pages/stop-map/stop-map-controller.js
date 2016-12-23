angular.module('pvta.controllers').controller('StopMapController', function ($scope, $ionicLoading, $stateParams, $ionicHistory, $ionicPopup, Stop, Map, ionicLoadingConfig) {
  ga('set', 'page', '/stop-map.html');
  ga('send', 'pageview');

  $scope.displayDirections = false;
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();

  var mapOptions = {
    //sets the center to Haigis Mall
    //This may have to change if we end up deploying this to
    //the entire PVTA ridership
    center: new google.maps.LatLng(42.386270, -72.525844),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  /****
  * Plots a stop on the map.  When clicked, the marker
  * will display a popup that gives some details about the stop.
  * Stop data needs to already have been loaded before this
  * function will succeed.
  */
  function placeStop () {
    // If we have stop details, plot it.
    if ($scope.stop && $scope.stop.Latitude && $scope.stop.Longitude) {
      var loc = new google.maps.LatLng($scope.stop.Latitude, $scope.stop.Longitude);
      Map.addMapListener(Map.placeDesiredMarker(loc), $scope.stop.Description + ' (' + $scope.stop.StopId + ')');
      return loc;
    }
    // If we don't have stop details, it means that we couldn't download any.
    // Show an error dialog and go back to the last page.
    else {
      var popup = $ionicPopup.alert({
        title: 'Unable to Map Stop',
        template: 'A network error occurred. Please make sure your device has an internet connection.'
      });
      popup.then(function () {
        $ionicHistory.goBack();
      });
    }
  }

  /***
   * Gets directions from the user's current location
   * to the stop in question and displays them on the UI.
  */
  $scope.calculateDirections = function () {
    $ionicLoading.show(ionicLoadingConfig);
    // A callback that we pass to the plotCurrentLocation
    // function below.  Handles actually getting
    // and displaying directions once we have a location.
    var cb = function (position) {
      // If we weren't able to get a location for any reason,
      // we should encounter a falsy.
      if (!position) {
        console.log('unable to get current location');
        $scope.noLocation = true;
        $scope.displayDirections = false;
        // Tell Google Analytics that a user doesn't have location
        ga('send', 'event', 'LocationFailure', '$cordovaGeolocation.getCurrentPosition', 'location failure passed to Stop Map after failing on Map Factory');
      }
      // If we have a location, download and display directions
      // from here to the stop.
      else {
        $scope.noLocation = false;
        $scope.displayDirections = true;
        directionsDisplay.setPanel(document.getElementById('directions'));
        start = position;
        var end = placeStop();
        var request = {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.WALKING
        };
        directionsService.route(request, function (result, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
          }
        });
      }
      $ionicLoading.hide();
    };
    // Get the current location. Once we have (or definitively don't have)
    // a location, the callback passed as a param will be called.
    Map.plotCurrentLocation(cb);
  };

  $scope.$on('$ionicView.enter', function () {
    $ionicLoading.show(ionicLoadingConfig);
    // The map div can have one of two ids:
    // one when directions are being shown, the other when not.
    // Check which id the map has, pluck it from the HTML, and bind it
    // to a variable.
    $scope.map = new google.maps.Map(document.getElementById($scope.displayDirections ? 'stop-map' : 'map'), mapOptions);
    Map.init($scope.map);
    // Be ready to display directions if the user requests them.
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap($scope.map);
    // Download the stop details and plot it on the map.
    $scope.stop = Stop.get({stopId: $stateParams.stopId}, function () {
      placeStop();
      $ionicLoading.hide();
    });
  });
});
