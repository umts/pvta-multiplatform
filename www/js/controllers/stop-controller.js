angular.module('pvta.controllers').controller('StopController', function($scope, $stateParams, $resource, $location, $interval, Stop, StopDeparture, moment, LatLong, FavoriteStops, SimpleRoute){
  
  var routes = [];
  
  var getDepartures = function(){
    var deps = StopDeparture.query({stopId: $stateParams.stopId}, function(){
      var directions = deps[0].RouteDirections;
      $scope.departures = [];
        for(var i = 0; i < directions.length; i++){
          routes.push(directions[i].RouteId);
          if(directions[i].Departures.length !== 0 && !directions[i].IsDone){
            var departureNum = 0;
            var sdt = directions[i].Departures[departureNum].SDT;
            var edt = directions[i].Departures[departureNum].EDT;
            var times = {s: moment(sdt).fromNow(), e: moment(edt).fromNow()};
            if(times.e.includes('ago')){
              for(var currentDeparture = 0; currentDeparture < directions[i].Departures.length; currentDeparture++){
                sdt = directions[i].Departures[currentDeparture].SDT;
                edt = directions[i].Departures[currentDeparture].EDT;
                times = {s: moment(sdt).fromNow(), e: moment(edt).fromNow()};
                if(!times.e.includes('ago')) {
                  directions[i].StringifiedTimes = times;
                  var r = {route: directions[i].RouteId, trip: directions[i].Departures[currentDeparture].Trip, departures: times};
                  $scope.departures.push(r);
                  break;
                }
              }
            }      
            else{
              directions[i].StringifiedTimes = times;
              var r = {route: directions[i].RouteId, trip: directions[i].Departures[departureNum].Trip, departures: times};
              $scope.departures.push(r);
            }
          }
        }
      getRoutes(routes);
    });
  } // end getDepartures
  var stop = Stop.get({stopId: $stateParams.stopId}, function(){
    stop.$save;
    getHeart();
  });
  $scope.stop = stop;
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
  };
  $scope.toggleHeart = function(liked){
    var name = 'Stop ' + stop.Name + " favorite";
    localforage.setItem(name, liked, function(err, value){
        if(value) {
          FavoriteStops.push(stop);
        }
        else {
          FavoriteStops.remove(stop);
        }
    });
  };
  
  var getRoutes = function(routes){
    $scope.colors = [];
    console.log(JSON.stringify(routes));
    for(var i = 0; i < routes.length; i++){
      var r = SimpleRoute.get({routeId: routes[i]}, function(){
        $scope.colors.push({id: r.RouteId, color: r.Color});
      });
    }
  };
  
  $scope.getRoute = function(id){
    $scope.color = SimpleRoute.get({routeId: id});
  };
  
  var getHeart = function(){
    var name = 'Stop ' + stop.Name + " favorite";
    localforage.getItem(name, function(err, value){
      $scope.liked = value;
    });
  };
})