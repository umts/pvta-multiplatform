angular.module('pvta.controllers').controller('StopMapController', function ($scope, $ionicLoading, $stateParams, $ionicHistory, $ionicPopup, Stop, Map) {
  ga('set', 'page', '/stop-map.html');
  ga('send', 'pageview');
  var bounds = new google.maps.LatLngBounds();
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
      Map.addMapListener(Map.placeDesiredMarker(loc), $scope.stop.Name + ' (' + $scope.stop.StopId + ')');
      return loc;
    }
    // If we don't have stop details, it means that we couldn't download any.
    // Show an error dialog and go back to the last page.
    else {
      var popup = $ionicPopup.alert({
        title: 'Unable to Map Stop',
        template: 'A network error occurred. Please make sure your device has an internet connection.'
      });
      popup.then(function(res) {
        $ionicHistory.goBack();
      });
    }
  }

  $scope.calculateDirections = function () {
    $ionicLoading.show({duration: 5000})
    var cb = function (position) {
      if (position === false) {
        console.log('unable to get current location');
        $scope.noLocation = true;
        $scope.displayDirections = false;
      }
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
    Map.plotCurrentLocation(cb);
  };

  $scope.$on('$ionicView.enter', function () {
    $ionicLoading.show({});
    // The map div can have one of two ids: one when showing directions,
    // the other when not.
    // Check which id the map has, pluck it from the HTML, and bind it
    // to a variable.
    $scope.map = new google.maps.Map(document.getElementById($scope.displayDirections? 'stop-map' : 'map'), mapOptions);
    Map.init($scope.map, bounds);
    // Be ready to display directions if the user requests them.
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap($scope.map);
    // Download the stop details and plot it on the map.
    $scope.stop = Stop.get({stopId: $stateParams.stopId}, function () {
      placeStop();
      $ionicLoading.hide()
    });
  });

});
