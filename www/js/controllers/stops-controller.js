angular.module('pvta.controllers').controller('StopsController', function($scope, $resource){
  $scope.stops = $resource('http://bustracker.pvta.com/infopoint/rest/stops/getallstops').query();
  })