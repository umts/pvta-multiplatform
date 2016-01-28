angular.module('starter.controllers').controller('StopsCtrl', function($scope, $resource){
  $scope.stops = $resource('http://bustracker.pvta.com/infopoint/rest/stops/getallstops').query();
  })