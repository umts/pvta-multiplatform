angular.module('pvta.controllers').controller('StopController', function ($scope, $stateParams, $resource, $location, $interval, Stop, StopDeparture, moment, LatLong, FavoriteStops, SimpleRoute) {
  $scope.getRoute = function (id) {
    var x = SimpleRoute.get({routeId: id}, function () {
      $scope.routeList[id] = (x);
    });
  };

  var getRoutes = function (routes) {
    _.each(routes, function (route) {
      $scope.getRoute(route.RouteId);
    });
  };

  var getHeart = function () {
    FavoriteStops.contains($scope.stop, function (bool) {
      $scope.liked = bool;
    });
  };

  $scope.getDepartures = function () {
    var routes = [];
    var deps = StopDeparture.query({stopId: $stateParams.stopId}, function () {
      if (deps) {
        var directions = deps[0].RouteDirections;
        $scope.directions = [];
        _.each(directions, function (direction) {
          if (direction.Departures.length !== 0 && !direction.IsDone) {
            var dir = {RouteId: direction.RouteId, departures: []};
            if (!(_.contains(routes, direction.RouteId))) {
              routes.push(direction.RouteId);
              _.each(direction.Departures, function (departure) {
                if (moment(departure.EDT).fromNow().includes('ago')) return;
                else {
                  var times = {s: moment(departure.SDT).fromNow(), e: moment(departure.EDT).fromNow()};
                  departure.Times = times;
                  dir.departures.push(departure);
                }
              });
              $scope.directions.push(dir);
            }
            else {
              _.each(direction.Departures, function(departure) {
                if (moment(departure.EDT).fromNow().includes('ago')) return;
                else {
                  var times = {s: moment(departure.SDT).fromNow(), e: moment(departure.EDT).fromNow()};
                  departure.Times = times;
                  dir.departures.push(departure);
                }
              });
              var alreadyExistingDirection = _.findWhere($scope.directions, {RouteId: direction.RouteId});
              var index = _.indexOf($scope.directions, alreadyExistingDirection);
              alreadyExistingDirection.departures.push(dir);
              $scope.directions[index] = alreadyExistingDirection;
            }
          }
        }); // end underscore.each
        getRoutes($scope.directions);
      } // end highest if
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
        if (value <= 1000) {
          value = 30000;
        }
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

  $scope.toggleHeart = function () {
    FavoriteStops.contains($scope.stop, function (bool) {
      if (bool) {
        FavoriteStops.remove($scope.stop);
      }
      else {
        FavoriteStops.push($scope.stop);
      }
    });
  };
  $scope.routeList = {};

  $scope.refresh = function () {
    $scope.getDepartures();
    $scope.$broadcast('scroll.refreshComplete');
  };
  $scope.toggleGroup = function (group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function (group) {
    return $scope.shownGroup === group;
  };
});
