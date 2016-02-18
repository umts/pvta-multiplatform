angular.module('pvta.controllers').controller('VehicleController', function($scope, $stateParams, Vehicle, LatLong, $location, KML){
  $scope.vehicle = Vehicle.get({vehicleId: $stateParams.vehicleId});
  $scope.setCoordinates = function(lat, long){
    LatLong.push(lat, long);
    //console.log($scope.vehicle.BlockFareboxId.toString().substring(0, 2));
    KML.push($scope.vehicle.BlockFareboxId.toString().substring(0, 2));
    $location.path('/app/map');
  }
});
