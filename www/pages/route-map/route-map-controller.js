angular.module('pvta.controllers').controller('RouteMapController', function ($scope, $stateParams, $ionicLoading, Map, Route) {
  ga('set', 'page', '/route-map.html');
  ga('send', 'pageview');

  var mapOptions = {
    center: new google.maps.LatLng(42.386270, -72.525844),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  Map.init($scope.map);

  function placeVehicles () {
  //places every vehicle on said route on the map
    _.each($scope.vehicles, function (vehicle) {
      var message;
      var loc = new google.maps.LatLng(vehicle.Latitude, vehicle.Longitude);

      //if the vehicle is on time, make the text green. If it's late, make the text red and say late by how much
      if (vehicle.DisplayStatus === 'On Time') {
        message = '<h4 style=\'color: green;\'>Bus ' + vehicle.Name + ' - ' + vehicle.DisplayStatus + '</h4>';
      }
      else {
        message = '<h4 style=\'color: red;\'>Bus ' + vehicle.Name + ' - ' + vehicle.DisplayStatus
          + ' by ' + vehicle.Deviation + ' minutes</h4>';
      }

      //sets the content of the window to have a ton of information about the vehicle
      var content = '<div style=\'font-family: Arial;text-align: center\'><h3 style=\'color: #' + $scope.route.Color + '\'>'
      + $scope.route.RouteAbbreviation + ': ' + vehicle.Destination + '</h3>' + message + '<h4>Last Stop: ' + vehicle.LastStop + '</h4></div>';

      //add a listener for that vehicle with that content as part of the infobubble
      var icon = {
        path: "M842.998 448h-655.77c-19.108 0-34.836 16.425-34.836 35.103 0 3.113 0.573 6.636 1.208 9.462l34.898 243.692c2.97 15.831 17.224 18.944 34.284 18.944h584.765c16.937 0 31.314-2.847 34.243-18.616l34.898-248.136c0.532-2.888 1.229-4.588 1.229-7.7-0.020-18.678-15.831-32.748-34.918-32.748zM816.763 174.694c-36.925 0-66.867 29.061-66.867 65.29 0 35.983 29.942 65.004 66.867 65.004 36.68 0 66.683-29.020 66.683-65.004 0-36.229-30.003-65.29-66.683-65.29zM212.582 174.694c-36.659 0-66.621 29.061-66.621 65.29 0 35.983 29.962 65.004 66.621 65.004 37.028 0 66.929-29.020 66.929-65.004 0-36.229-29.901-65.29-66.929-65.29zM327.68 898.56h409.6v-61.44h-409.6c-40.96 0-40.96 61.44 0 61.44zM905.257 804.557c-11.96 57.61-46.899 80.814-103.895 103.997-56.893 23.101-188.744 50.79-287.908 50.79-99.594 0-232.12-27.709-289.075-50.79-56.975-23.204-91.341-46.387-103.199-103.997l-39.26-320.696v-445.46h61.44v-40.96c0-81.92 102.4-81.92 102.4 0v40.96h512v-40.96c0-81.92 122.88-81.92 122.88 0v40.96h61.44v445.46l-36.823 320.696z",
        fillColor: '#' + $scope.route.Color,
        fillOpacity: 1,
        strokeWeight: 0,
        scale: .03,
        rotation: vehicle.Heading
      };
      console.log(JSON.stringify(icon));
      Map.addMapListener(Map.placeDesiredMarker(loc, icon), content);
    });
  }

  $scope.$on('$ionicView.enter', function () {
    $ionicLoading.show({});
    Map.plotCurrentLocation();
    $scope.route = Route.get({routeId: $stateParams.routeId}, function () {
      $scope.stops = $scope.route.Stops;
      $scope.vehicles = $scope.route.Vehicles;
      Map.addKML($scope.route.RouteTraceFilename);
      placeVehicles();
      $ionicLoading.hide();
    });
  });

});
