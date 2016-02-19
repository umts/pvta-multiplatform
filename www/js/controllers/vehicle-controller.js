angular.module('pvta.controllers').controller('VehicleController', function($scope, $stateParams, Vehicle, LatLong, $location, KML){
  $scope.vehicle = Vehicle.get({vehicleId: $stateParams.vehicleId});
  
  $scope.setCoordinates = function(lat, long){
    LatLong.push(lat, long);
    console.log($stateParams.route);
    KML.push($stateParams.route);
    $location.path('/app/map');
  }
});
