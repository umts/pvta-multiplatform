angular.module('pvta.controllers').controller('VehicleController', function ($scope, $state, $stateParams, $location, Vehicle, Route, KML) {
  ga('set', 'page', '/vehicle.html');
  ga('send', 'pageview');
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
