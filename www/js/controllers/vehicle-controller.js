angular.module('starter.controllers').controller('VehicleController', function($scope, $stateParams, Vehicle, LatLong, $location){
  $scope.vehicle = Vehicle.get({vehicleId: $stateParams.vehicleId});
  $scope.setCoordinates = function(lat, long){
    LatLong.push(lat, long);
    $location.path('/app/map')
  }
});
