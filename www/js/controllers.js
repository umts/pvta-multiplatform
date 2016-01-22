angular.module('starter.controllers', ['starter.services'])

.controller('VehiclesCtrl', function($scope, $resource, Vehicle){
  $scope.vehicles = $resource('http://bustracker.pvta.com/infopoint/rest/vehicles/getallvehicles').query(function(){
    $scope.vehicles.sort(function(a, b){return a.Name - b.Name});
  });
});
