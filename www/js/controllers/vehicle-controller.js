angular.module('pvta.controllers').controller('VehicleController', function($scope, $stateParams, Vehicle, LatLong, $location, KML){
  var getVehicle = function(){
    $scope.vehicle = Vehicle.get({vehicleId: $stateParams.vehicleId});
  };

  getVehicle();

  $scope.setCoordinates = function(lat, long){
    LatLong.push(lat, long);
    KML.push($stateParams.route);
    $location.path('/app/map');
  };

  $scope.refresh = function(){
    getVehicle();
    $scope.$broadcast('scroll.refreshComplete');
  };
});
