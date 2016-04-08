angular.module('pvta.controllers').controller('VehicleController', function ($scope, $state, $stateParams, $location, Vehicle, LatLong, Route, KML) {
  var getVehicle = function () {
    $scope.vehicle = Vehicle.get({vehicleId: $stateParams.vehicleId});
  };

  $scope.route = Route.get({routeId: $stateParams.routeId});

  getVehicle();

  $scope.setCoordinates = function () {
    KML.push($scope.route.RouteTraceFilename);
    $state.go('app.vehicle-map', {vehicleId: $stateParams.vehicleId});
  };

  $scope.refresh = function () {
    getVehicle();
    $scope.$broadcast('scroll.refreshComplete');
  };

});
