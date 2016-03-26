angular.module('pvta.controllers').controller('StopController', function ($scope, $stateParams, $resource, $location, $interval, Stop, StopDeparture, moment, LatLong, FavoriteStops, SimpleRoute) {

  $scope.getDepartures = function () {
    var routes = [];
    var deps = StopDeparture.query({stopId: $stateParams.stopId}, function () {
      var directions = deps[0].RouteDirections;
      $scope.departures = [];
      for (var i = 0; i < directions.length; i++) {
        routes.push(directions[i].RouteId);
        if (directions[i].Departures.length !== 0 && !directions[i].IsDone) {
          var departureNum = 0;
          var sdt = directions[i].Departures[departureNum].SDT;
          var edt = directions[i].Departures[departureNum].EDT;
          var times = {s: moment(sdt).fromNow(), e: moment(edt).fromNow()};
          if (times.e.includes('ago')) {
            for (var currentDeparture = 0; currentDeparture < directions[i].Departures.length; currentDeparture++) {
              sdt = directions[i].Departures[currentDeparture].SDT;
              edt = directions[i].Departures[currentDeparture].EDT;
              times = {s: moment(sdt).fromNow(), e: moment(edt).fromNow()};
              if (!times.e.includes('ago')) {
                directions[i].StringifiedTimes = times;
                var r = {route: directions[i].RouteId, trip: directions[i].Departures[currentDeparture].Trip, departures: times};
                $scope.departures.push(r);
                break;
              }
            }
          }
          else {
            directions[i].StringifiedTimes = times;
            var r = {route: directions[i].RouteId, trip: directions[i].Departures[departureNum].Trip, departures: times};
            $scope.departures.push(r);
          }
        } // end first if
      } // end for
      getRoutes($scope.departures);
    });
  }; // end getDepartures
  var stop = Stop.get({stopId: $stateParams.stopId}, function () {
    stop.$save;
    getHeart();
  });
  $scope.stop = stop;

  // Load the departures for the first time
  $scope.getDepartures();
  var timer;
  /********************************************
   * Every time we enter a Stop page,
   * retrieve the autoRefresh setting.
   * If set by the user, we use that as our
   * timer value. If a sanity-check on the value
   * fails (ie anything <= 1s) or
   * localforage throws an error, set to 30s.
   ********************************************/
  $scope.$on('$ionicView.enter', function () {
    localforage.getItem('autoRefresh', function (err, value) {
      if (value) {
        if (value <= 1000) value = 30000;
        timer = $interval(function () {
          $scope.getDepartures();
        }, value);
      }
      else {
        timer = $interval(function () {
          $scope.getDepartures();
        }, 30000);
        console.log(err);
      }
    });
  });
  /****************************************
   * When the angular $scope recognizes that
   * ionic's view engine has fired the *leave*
   * event, stop the autorefresh!
   ****************************************/
  $scope.$on('$ionicView.leave', function () {
    $interval.cancel(timer);
  });

  $scope.setCoordinates = function (lat, long) {
    LatLong.push(lat, long);
    $interval.cancel(timer);
    $location.path('/app/map/stop');
  };

  $scope.toggleHeart = function (liked) {
    FavoriteStops.contains($scope.stop, function(bool){
      if(bool) {
        FavoriteStops.remove($scope.stop);
      } 
      else {
        FavoriteStops.push($scope.stop);
      }
    });
  };
  var getRoutes = function (routes) {
    for (var i = 0; i < routes.length; i++) {
      $scope.getRoute(routes[i].route);
    }
  };
  $scope.routeList = {};
  $scope.getRoute = function (id) {
    var x = SimpleRoute.get({routeId: id}, function () {
      $scope.routeList[id] = (x);
    });
  };
  var getHeart = function () {
    FavoriteStops.contains($scope.stop, function(bool){
      $scope.liked = bool;
      $scope.$apply();
    });
  };

  $scope.refresh = function () {
    $scope.getDepartures();
    $scope.$broadcast('scroll.refreshComplete');
  };
})
