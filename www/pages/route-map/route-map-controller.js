angular.module('pvta.controllers').controller('RouteMapController', function ($scope, $stateParams, $ionicLoading, Map, Route, $interval, RouteVehicles, ionicLoadingConfig) {
  ga('set', 'page', '/route-map.html');
  ga('send', 'pageview');
  var timer;

  var mapOptions = {
    center: new google.maps.LatLng(42.386270, -72.525844),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  Map.init($scope.map);

  function placeVehicles (isVehicleRefresh) {
  //places every vehicle on said route on the map
    Map.removeAllMarkers();
    _.each($scope.vehicles, function (vehicle) {
      var message;
      var loc = new google.maps.LatLng(vehicle.Latitude, vehicle.Longitude);

      //if the vehicle is on time, make the text green. If it's late, make the text red and say late by how much
      if (vehicle.DisplayStatus === 'On Time') {
        message = '<h4 style=\'color: green;\'>Bus ' + vehicle.Name + ' - ' + vehicle.DisplayStatus + '</h4>';
      }
      else {
        message = '<h4 style=\'color: red;\'>Bus ' + vehicle.Name + ' - ' + vehicle.DisplayStatus +
          ' by ' + vehicle.Deviation + ' minutes</h4>';
      }

      //sets the content of the window to have a ton of information about the vehicle
      var content = '<div style=\'font-family: Arial;text-align: center\'><h3 style=\'color: #' +
      $scope.route.Color + '\'>' + $scope.route.RouteAbbreviation + ': ' +
      vehicle.Destination + '</h3>' + message + '<h4>Last Stop: ' + vehicle.LastStop + '</h4>' +
      '<h4>Last Updated: ' + moment(vehicle.LastUpdated).format('h:mm:ss a') + '</h4></div>';
      // An bus-shaped icon, with the color of the current route and
      // rotated such that it is facing the same direction as the real bus.
      var icon = {
        path: Map.busSVGPath,
        fillColor: '#' + $scope.route.Color,
        fillOpacity: 1,
        strokeWeight: 0.5,
        scale: .03,
        // 180 degrees is rightside-up
        rotation: 180
      };
      //add a listener for that vehicle with that content as part of the infobubble
      Map.addMapListener(Map.placeDesiredMarker(loc, icon, isVehicleRefresh), content);
    });
  }

  $scope.$on('$ionicView.enter', function () {
    $ionicLoading.show(ionicLoadingConfig);
    Map.plotCurrentLocation();
    $scope.route = Route.get({routeId: $stateParams.routeId}, function () {
      $scope.stops = $scope.route.Stops;
      $scope.vehicles = $scope.route.Vehicles;
      Map.addKML($scope.route.RouteTraceFilename);
      placeVehicles();
      $ionicLoading.hide();
    });
    timer = $interval(function () {
      $scope.vehicles = RouteVehicles.query({id: $stateParams.routeId}, function () {
        placeVehicles(true);
      });
    }, 30000);
  });
  $scope.$on('$ionicView.leave', function () {
    $interval.cancel(timer);
  });
});
