angular.module('pvta.controllers').controller('StopController', function ($scope, $stateParams, $resource, $location, $interval, Stop, StopDeparture, moment, LatLong, FavoriteStops, SimpleRoute) {

  // For a given RouteId, downloads the simplest
  // version of the details for that route from
  // Avail.  Adds it to a $scope-wide list.
  // Returns nothing.
  $scope.getRoute = function (id) {
    var x = SimpleRoute.get({routeId: id}, function () {
      $scope.routeList[id] = (x);
    });
  };
  // Calls getRoute() for each RouteId in
  // the input array.
  // Ex input: [20030, 30031, 20035]
  var getRoutes = function (routes) {
    _.each(routes, function (routeId) {
      $scope.getRoute(routeId);
    });
  };

  // Check whether this stop is favorited.
  // Used to allow the 'heart' in the view
  // to draw itself accordingly.
  var getHeart = function () {
    FavoriteStops.contains($scope.stop, function (bool) {
      $scope.liked = bool;
    });
  };

  $scope.getDepartures = function () {
    $scope.departuresByRoute = [];
    var routes = [];
    var deps = StopDeparture.query({stopId: $stateParams.stopId}, function () {
      if (deps) {
        // Avail returns a one element array that contains
        // a ton of stuff. Pull this stuff out.
        var directions = deps[0].RouteDirections;
        // First, push each route to an array so that we can
        // keep track of ROUTES vs DIRECTIONS
        routes = _.uniq(_.pluck(directions, 'RouteId'));

        var dirs = []
        _.each(directions, function(direction) {
          if (direction.Departures && direction.Departures.length != 0 && !direction.IsDone) {
            var newDirs = {RouteId: direction.RouteId, Departures: direction.Departures};
            dirs.push(newDirs);
          }
        });
        var closer = []
        _.each(routes, function(route) {
          var x = _.where(dirs, {RouteId : route});
          var y = _.pluck(x, 'Departures');
          var z = _.flatten(y, true);
          if (z && z.length > 0) {
            var newDir = {RouteId: route, Departures: z};
            closer.push(newDir);
          }
        });
        console.log(JSON.stringify(closer));
        $scope.departuresByRoute = [];
        _.each(closer, function(routeAndDepartures) {
          var newDirsWithTimes = {RouteId: routeAndDepartures.RouteId, Departures: []}
          _.each(routeAndDepartures.Departures, function(departure) {
           if (moment(departure.EDT).fromNow().includes('ago')) return;
            else {
              var times = {s: moment(departure.SDT).fromNow(), e: moment(departure.EDT).fromNow()};
              departure.Times = times;
              newDirsWithTimes.Departures.push(departure);
            }
          });
          $scope.departuresByRoute.push(newDirsWithTimes);
        })


        // The very last thing we need to do is download
        // some details (name, color, etc) for each route that has
        // upcoming departures at this stop.
        getRoutes(routes);
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
        // Refresh departures every `value` seconds
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

  // Push the coordinates of the stop to
  // the service and redirect to the
  // StopMapController.
  $scope.setCoordinates = function (lat, long) {
    LatLong.push(lat, long);
    $interval.cancel(timer);
    $location.path('/app/map/stop');
  };

  // Update whether this Stop is favorited.
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
  // Executed when the "pull to refresh" directive
  // in the view is activated
  $scope.refresh = function () {
    $scope.getDepartures();
    $scope.$broadcast('scroll.refreshComplete');
  };

  // **Sets** whether a route's
  // departures have been expanded on the page
  $scope.toggleGroup = function (group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  // **Checks** whether a route's departures
  // have been expanded on the page
  $scope.isGroupShown = function (group) {
    return $scope.shownGroup === group;
  };
});
