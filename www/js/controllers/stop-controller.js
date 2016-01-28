angular.module('starter.controllers').controller('StopController', function($scope, $stateParams, $resource, $location, $interval, Stop, StopDeparture, moment, LatLong){
  var getDepartures = function(){
    var deps = StopDeparture.query({stopId: $stateParams.stopId}, function(){
      var directions = deps[0].RouteDirections;
      $scope.departures = [];
        for(var i = 0; i < directions.length; i++){
          if(directions[i].Departures.length !== 0 && !directions[i].IsDone){
            var departureNum = 0;
            var sdt = directions[i].Departures[departureNum].SDT;
            var edt = directions[i].Departures[departureNum].EDT;
            var times = {s: moment(sdt).fromNow(), e: moment(edt).fromNow()};
            while(times.e.includes('ago')){
              departureNum++;
              sdt = directions[i].Departures[departureNum].SDT;
              edt = directions[i].Departures[departureNum].EDT;
              times = {s: moment(sdt).fromNow(), e: moment(edt).fromNow()};
            }
            directions[i].StringifiedTimes = times;
            var r = {route: directions[i].RouteId, trip: directions[i].Departures[departureNum].Trip, departures: times};
            $scope.departures.push(r);
          }
        }
    });
  } // end getDepartures
  $scope.stop = Stop.get({stopId: $stateParams.stopId});
  getDepartures();
  var timer=$interval(function(){
        getDepartures();
      },30000);
  $scope.$on('$destroy', function() {
    $interval.cancel(timer);
  });
  $scope.setCoordinates = function(lat, long){
    LatLong.push(lat, long);
    $interval.cancel(timer);
    $location.path('/app/map')
  }
})