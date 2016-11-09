angular.module('pvta.controllers').controller('StopController', function ($scope, $stateParams, $interval, $state, Stop, StopDeparture, moment, FavoriteStops, SimpleRoute, $ionicLoading, $ionicPopup) {
  ga('set', 'page', '/stop.html');
  ga('send', 'pageview');
  $scope.ROUTE_DIRECTION = '0';
  $scope.TIME = '1';
  $scope.filterOptions = ['Route', 'Time'];
  $scope.sort = $scope.ROUTE_DIRECTION;

  /**
   * Lets the user choose how they want departures to be sorted
   */
  $scope.chooseFilter = function () {
    if ($scope.sort === $scope.ROUTE_DIRECTION) {
      $scope.sort = $scope.TIME;
      ga('send', 'event', 'StopDeparturesSortingChanged', 'StopController.chooseFilter()', 'Departures order changed: by time.');
    }
    else {
      $scope.sort = $scope.ROUTE_DIRECTION;
      ga('send', 'event', 'StopDeparturesSortingChanged', 'StopController.chooseFilter()', 'Departures order changed: by route.');
    }
  };

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
    $ionicLoading.hide();
  };

  // Check whether this stop is favorited.
  // Used to allow the 'heart' in the view
  // to draw itself accordingly.
  var getHeart = function () {
    FavoriteStops.contains($stateParams.stopId, function (bool) {
      console.log(bool)
      $scope.liked = bool;
    });
  };

  function calculateTimes (departure) {
    return {sExact: moment(departure.SDT).format('LT'),
              eExact: moment(departure.EDT).format('LT'),
              sRelative: moment(departure.SDT).fromNow(),
              eRelative: moment(departure.EDT).fromNow(),
              eRelativeNoPrefix: moment(departure.EDT).fromNow(true)
            };
  }

  function sort(directions) {
    $scope.departuresByDirection = []
    $scope.departuresByTime = [];
    // Avail returns an array of RouteDirections. We must deal
    // with the Departures for each Direction.
    _.each(directions, function (direction) {
      if (direction.Departures && direction.Departures.length != 0 && !direction.IsDone) {
        // Sorting Departures by Direction requires us to
        // maintain a tmp array of valid departures for a
        // given direction.
        var futureDepartures = [];
        // For each Departure for a given RouteDirection...
        _.each(direction.Departures, function (departure) {
          // A departure is invalid if it was in the past
          if (!moment(departure.EDT).isAfter(Date.now())) {
            return;
          }
          /* Manipuate the departure object.
           * When sorting by Direction, we only need to
           * obtain the stringified departure times
           * and save the departure to futureDepartures.

           * When sorting by Time, pull out only the
           * necessary details from the Departures
           * and hold onto them.
           */
          else {
            // Departures by time: we can use a stripped down
            // version of the RouteDirection, because each
            // departure will be its own entry in the list.
            var lightweightDirection = {RouteId: direction.RouteId};
            var times = calculateTimes(departure);
            departure.Times = times;
            lightweightDirection.Times = times;
            // Departures by time: marry this departure with its RouteId;
            // that's all it needs.
            lightweightDirection.Departures = departure;
            // Departures by RouteDirection: this is a valid departure,
            // so add it to the array.
            futureDepartures.push(departure);
            $scope.departuresByTime.push(lightweightDirection);
          }
        });
        /* Departures by RouteDirection: now that we
         * have all the valid departures for a given direction,
         * overwrite the RouteDirection's old departures array.
         */
        direction.Departures = futureDepartures;
        $scope.departuresByDirection.push(direction);
      }
    });
    // Departures by time: Sort the list of all
    // departures by Estimated Departure Time.
    $scope.departuresByTime = _.sortBy($scope.departuresByTime, function(direction) {
      return direction.Departures.EDT;
    });
  }

  $scope.getDepartures = function () {
    $ionicLoading.show();
    StopDeparture.query({ stopId: $stateParams.stopId }, function (deps) {
      ga('send', 'event', 'StopDeparturesLoaded', 'StopController.getDepartures()', 'Stop id:' + $stateParams.stopId);
      if (deps) {
        // Avail returns a one element array that contains
        // a ton of stuff. Pull this stuff out.
        var directions = deps[0].RouteDirections;
        sort(directions)
        /* Step 0:
         * Get a unique list of RouteIds that service this stop.
         * There can be multiple RouteDirections with the same
         * RouteId, so thus the uniqueness requirement.

         * Afterwards, download some basic details about
         * each route servicing this stop.
         */
        routes = _.uniq(_.pluck(directions, 'RouteId'));
        getRoutes(_.pluck($scope.departuresByDirection, 'RouteId'));
        /* Step 1:
         * For each RouteDirection,
         * pull out its RouteId and Departures array,
         * assuming that it HAS departures and isn't 'done.'
         */
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

        /* Step 3:
         * We now have an array of {RouteId, Departure}
         * objects. We now get "stringified" times for each departure.
         * We define a new object ($scope.departuresByRoute) to hold
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

        /* Step 5:
         * Sort the departures
         * for each route.
         */
       }
     });
   };

  Stop.get({stopId: $stateParams.stopId}, function (stop) {
    $scope.stop = stop;
  });

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
    $ionicLoading.show({});
    getHeart();
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

  // Redirect to the StopMapController.
  $scope.setCoordinates = function () {
    $interval.cancel(timer);
    $state.go('app.stop-map', {stopId: $stateParams.stopId});
  };

  // Update whether this Stop is favorited.
  $scope.toggleHeart = function () {
    FavoriteStops.contains($stateParams.stopId, function (bool) {
      if (bool === true) {
        console.log('removing stop, it was facorited')
        FavoriteStops.remove($scope.stop);
      }
      else {
        console.log('adding stop, it wasnt favorites');
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
  $scope.toggleRouteDropdown = function (routeDirection) {
    if ($scope.isRouteDropdownShown(routeDirection)) {
      $scope.shownRoute = null;
    } else {
      $scope.shownRoute = routeDirection.RouteId + routeDirection.DirectionCode;
    }
  };
  // **Checks** whether a route's departures
  // have been expanded on the page
  $scope.isRouteDropdownShown = function (routeDirection) {
    return $scope.shownRoute === (routeDirection.RouteId + routeDirection.DirectionCode);
  };
});
