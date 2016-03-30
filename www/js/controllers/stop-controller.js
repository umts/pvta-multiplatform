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
        // Now, loop through each RouteId
        _.each(routes, function(id){
          // Pull out the departures that match the RouteId
          // of our current iteration:
          var departuresForRoute = _.map(directions, function(routeDirection){
            // Make sure that the departures array exists / isn't empty
            // (basically is a truthy), and that this direction
            // isn't done servicing this stop for the day.
            if (routeDirection.Departures.length != 0 && !routeDirection.IsDone) {
              // Finally, return the departures that
              // match this RouteId
              if (routeDirection.RouteId === id) {
                return routeDirection.Departures;
              }
            }
          });
          //At this point, we should have an array of every
          // departure for the current route at this stop,
          // regardless of direction.
          // Call _.compact to remove all falsy values.
          departuresForRoute = _.flatten(_.compact(departuresForRoute));
          //console.log(JSON.stringify(departuresForRoute));
          // Before we add it to the master list for the entire stop,
          // we define an extra property **to each departure** to make the times
          // easily readable.
          _.each(departuresForRoute, function(departure, indexInList){
            // If the departure was in the past, toss it.
            if (moment(departure.EDT).fromNow().includes('ago')) departuresForRoute[indexInList] = null;
            else {
              // stringify the times
              var times = {s: moment(departure.SDT).fromNow(), e: moment(departure.EDT).fromNow()};
              // Throw them into the object, which we're editing in-place
              departure.Times = times;
              // Reassign the object in the master list to our edited object
              departuresForRoute[indexInList] = departure;
            }
          });
          // Remove any null values created by departures in the past.
          departuresForRoute = _.compact(departuresForRoute);
          // This is the last thing we do for each route:
          // push it (as an object) to the array that will be used in the view.
          $scope.departuresByRoute.push({RouteId: id, Departures: departuresForRoute});
        });
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
