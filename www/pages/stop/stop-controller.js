function StopController ($scope, $stateParams, $interval, $state, Stop, StopDeparture, moment, FavoriteStops, SimpleRoute, $ionicLoading) {
  ga('set', 'page', '/stop.html');
  ga('send', 'pageview');
  var self = this;
  // For a given RouteId, downloads the simplest
  // version of the details for that route from
  // Avail.  Adds it to a $scope-wide list.
  // Returns nothing.
  self.getRoute = function (id) {
    var x = SimpleRoute.get({routeId: id}, function () {
      self.routeList[id] = (x);
    });
  };
  // Calls getRoute() for each RouteId in
  // the input array.
  // Ex input: [20030, 30031, 20035]
  var getRoutes = function (routes) {
    _.each(routes, function (routeId) {
      self.getRoute(routeId);
    });
  };

  // Check whether this stop is favorited.
  // Used to allow the 'heart' in the view
  // to draw itself accordingly.
  var getHeart = function () {
    FavoriteStops.contains(self.stop.StopId, function (bool) {
      self.liked = bool;
    });
  };

  self.getDepartures = function () {
    self.departuresByRoute = [];
    var routes = [];
    $ionicLoading.show();
    var deps = StopDeparture.query({stopId: $stateParams.stopId}, function () {
      if (deps) {
        // Avail returns a one element array that contains
        // a ton of stuff. Pull this stuff out.
        var directions = deps[0].RouteDirections;
        /* Step 0:
         * Get a unique list of RouteIds that service this stop.
         * There can be multiple RouteDirections with the same
         * RouteId, so thus the uniqueness requirement.
         */
        routes = _.uniq(_.pluck(directions, 'RouteId'));

        /* Step 1:
         * For each RouteDirection,
         * pull out its RouteId and Departures array,
         * assuming that it HAS departures and isn't 'done.'
         */
        var dirs = [];
        _.each(directions, function (direction) {
          if (direction.Departures && direction.Departures.length != 0 && !direction.IsDone) {
            var newDirs = {RouteId: direction.RouteId, Departures: direction.Departures};
            dirs.push(newDirs);
          }
        });
        /* Step 2:
         * For each RouteId, find all the departures
         * (obtained in Step 1) whose RouteDirection matches this Id.
         * This obtains an array of Departure arrays
         *    (this root array has one element when
         *       there's only 1 RouteDirection for a RouteId, but has
         *       n elements for each RouteId that has n RouteDirections
         *    ), so "flatten" it down to a single array.
         * Assuming this array of departures exists and
         * actually HAS departures, we have now
         * found every known departure for this route.
         *
         * The routeDepartures variable will contain
         * an array of routes and their corresponding
         * departures in form [{RouteId, Departures}, ...]
         */
        var routeDepartures = [];
        _.each(routes, function (route) {
          //[{RouteId: 20034, Departures[...]},]
          var entireObject = _.where(dirs, {RouteId : route});
          // [[...], [...]]
          var justDepartures = _.pluck(entireObject, 'Departures');
          // [, , , ]
          var flattenedDepartures = _.flatten(justDepartures, true);
          if (flattenedDepartures && flattenedDepartures.length > 0) {
            var newDir = {RouteId: route, Departures: flattenedDepartures};
            routeDepartures.push(newDir);
          }
        });
        /* Step 3:
         * We now have an array of {RouteId, Departure}
         * objects. We now get "stringified" times for each departure.
         * We define a new object (self.departuresByRoute) to hold
         * our final data.
         * For each route, loop through its departures.
         * For each departure:
         *    If it was estimated in the past:
                do not add it to the final array.
         *    Otherwise:
                Stringify its times, add them to the
                  original Departure object
         * Now that a route has its departures stringified, push
         * everything for that route to the final array.
         */
        self.departuresByRoute = [];
        _.each(routeDepartures, function (routeAndDepartures) {
          var newDirsWithTimes = {RouteId: routeAndDepartures.RouteId, Departures: []};
          _.each(routeAndDepartures.Departures, function (departure) {
            if (!moment(departure.EDT).isAfter(Date.now())) return;
            else {
              var times = {sExact: moment(departure.SDT).format('LT'),
                           eExact: moment(departure.EDT).format('LT'),
                           sRelative: moment(departure.SDT).fromNow(),
                           eRelative: moment(departure.EDT).fromNow(),
                           eRelativeNoPrefix: moment(departure.EDT).fromNow(true)
                         };
              departure.Times = times;
              newDirsWithTimes.Departures.push(departure);
            }
          });
          if (newDirsWithTimes.Departures.length > 0) {
            self.departuresByRoute.push(newDirsWithTimes);
          }
        });
        /* Step 4:
         * Download some details (name, color, etc) for each
         * route that has upcoming departures at this stop.
         */
        getRoutes(_.pluck(self.departuresByRoute, 'RouteId'));

        /* Step 5:
         * Sort the departures
         * for each route.
         */
        var allSortedDepartures = [];
        _.each(self.departuresByRoute, function (routeDepartures) {
          // The routeDepartures object looks like
          // {RouteId, Departures}, where Departures is
          // an array of objects with numerous properties.
          // First, sort the array by Estimated Departure Time.
          routeDepartures.Departures = _.sortBy(routeDepartures.Departures, 'EDT');
          // Add the now sorted routeDepartures object to our
          // auxiliary array.
          allSortedDepartures.push(routeDepartures);
        });
        // Once we've sorted the departures for each route,
        // reassign our global object.
        self.departuresByRoute = allSortedDepartures;
      }
      $ionicLoading.hide();
    });
  };

  Stop.get({stopId: $stateParams.stopId}, function (stop) {
    self.stop = stop;
    getHeart();
  });

  // Load the departures for the first time
  self.getDepartures();
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
    $ionicLoading.show({});
    getHeart();
    localforage.getItem('autoRefresh', function (err, value) {
      if (value) {
        if (value <= 1000) {
          value = 30000;
        }
        // Refresh departures every `value` seconds
        timer = $interval(function () {
          self.getDepartures();
        }, value);
        $ionicLoading.hide();
      }
      else {
        timer = $interval(function () {
          self.getDepartures();
        }, 30000);
        $ionicLoading.hide();
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
  self.setCoordinates = function () {
    $interval.cancel(timer);
    $state.go('app.stop-map', {stopId: $stateParams.stopId});
  };

  // Update whether this Stop is favorited.
  self.toggleHeart = function () {
    FavoriteStops.contains(self.stop.StopId, function (bool) {
      if (bool === true) {
        FavoriteStops.remove(self.stop);
      }
      else {
        FavoriteStops.push(self.stop);
      }
    });
  };

  self.routeList = {};
  // Executed when the "pull to refresh" directive
  // in the view is activated
  self.refresh = function () {
    self.getDepartures();
    $scope.$broadcast('scroll.refreshComplete');
  };

  // **Sets** whether a route's
  // departures have been expanded on the page
  self.toggleRouteDropdown = function (routeId) {
    if (self.isRouteDropdownShown(routeId)) {
      self.shownRoute = null;
    } else {
      self.shownRoute = routeId;
    }
  };
  // **Checks** whether a route's departures
  // have been expanded on the page
  self.isRouteDropdownShown = function (routeId) {
    return self.shownRoute === routeId;
  };
}
angular.module('pvta.controllers').controller('StopController', StopController);
StopController.$inject = ['$scope', '$stateParams', '$interval', '$state', 'Stop', 'StopDeparture', 'moment', 'FavoriteStops', 'SimpleRoute', '$ionicLoading'];
