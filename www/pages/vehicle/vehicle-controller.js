angular.module('pvta.controllers').controller('VehicleController', function ($scope, $state, $stateParams, $location, Vehicle, Route) {
  ga('set', 'page', '/vehicle.html');
  ga('send', 'pageview');

  // Download the vehicle and route
  $scope.vehicle = Vehicle.get({vehicleId: $stateParams.vehicleId});
  $scope.route = Route.get({routeId: $stateParams.routeId});

  $scope.refresh = function () {
    getVehicle();
    $scope.$broadcast('scroll.refreshComplete');
  };
});
