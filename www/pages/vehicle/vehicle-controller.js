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

  $scope.isArticulated = function (nameString) {
    var nameInt = parseInt(nameString);
    // Match UMass Transit articulated buses
    if (nameInt >= 3400 && nameInt < 3500) {
      return true;
    }
    // Match VatCo articulated buses
    else if (nameInt >= 7900 && nameInt < 8000) {
      return true;
    }
    // There are no SatCo articulated buses a/o 2016.
    else return false;
  }
});
