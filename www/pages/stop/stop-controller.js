angular.module('pvta.controllers').controller('StopController', function ($scope, $stateParams, $interval, $state, Stop, StopDeparture, moment, FavoriteStops, SimpleRoute, $ionicLoading, ionicLoadingConfig, Helper) {
  ga('set', 'page', '/stop.html');
  ga('send', 'pageview');
  $scope.ROUTE_DIRECTION = '0';
  $scope.TIME = '1';
  $scope.order = $scope.ROUTE_DIRECTION;

  /**
   * Reports when the user changes the sorting.
   */
  $scope.sendOrderingAnalytics = function () {
    var eventName = 'StopDeparturesSortingChanged';
    var funcName = 'StopController.sendOrderingAnalytics()';
    if ($scope.order === $scope.ROUTE_DIRECTION) {
      ga('send', 'event', eventName, funcName, 'By time');
    }
    else {
      ga('send', 'event', eventName, funcName, 'By route');
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
      $scope.liked = bool;
    });
  };

  $scope.getDepartures = function () {
    $ionicLoading.show(ionicLoadingConfig);
    StopDeparture.query({ stopId: $stateParams.stopId }, function (deps) {
      if (deps) {
        // Avail returns a one element array that contains
        // a ton of stuff. Pull this stuff out.
        var directions = deps[0].RouteDirections;
        var sortedDepartures = Helper.sortStopDepartures(directions);
        $scope.departuresByDirection = sortedDepartures.ByRouteDirection;
        $scope.departuresByTime = sortedDepartures.ByTime;
        /*
         * Get a unique list of RouteIds that service this stop.
         * There can be multiple RouteDirections with the same
         * RouteId, so thus the uniqueness requirement.

         * Afterwards, download some basic details about
         * each route servicing this stop.
         */
        routes = _.uniq(_.pluck(directions, 'RouteId'));
        getRoutes(_.pluck($scope.departuresByDirection, 'RouteId'));
      }
    });
  };

  Stop.get({stopId: $stateParams.stopId}, function (stop) {
    $scope.stop = stop;
    ga('send', 'event', 'StopLoaded', 'StopController.self', 'Stop: ' + stop.Description + ' (' + $stateParams.stopId + ')');
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
    $ionicLoading.show(ionicLoadingConfig);
    loadOrdering();
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

  function saveOrdering () {
    localforage.setItem('stopDepartureOrdering', $scope.order) ;
    var eventName = 'StopDepartureOrderingSaved';
    var funcName = 'StopController.saveOrdering()';
    if ($scope.order === $scope.ROUTE_DIRECTION) {
      ga('send', 'event', eventName, funcName, 'By route');
    }
    else {
      ga('send', 'event', eventName, funcName, 'By time');
    }
  }

  function loadOrdering () {
    localforage.getItem('stopDepartureOrdering', function (err, ordering) {
      if (ordering && ordering === $scope.ROUTE_DIRECTION || ordering === $scope.TIME) {
        $scope.order = ordering;
      }
      else {
        $scope.order = $scope.ROUTE_DIRECTION;
      }
    });
  }
  /****************************************
   * When the angular $scope recognizes that
   * ionic's view engine has fired the *leave*
   * event, stop the autorefresh!
   ****************************************/
  $scope.$on('$ionicView.leave', function () {
    saveOrdering();
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
