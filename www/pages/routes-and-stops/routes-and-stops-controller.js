angular.module('pvta.controllers').controller('RoutesAndStopsController', function ($scope, $ionicFilterBar, $cordovaGeolocation, RouteForage, StopsForage, $ionicLoading, $stateParams) {
  ga('set', 'page', '/routes-and-stops.html');
  ga('send', 'pageview');
  // We can control which list is shown via the page's URL.
  // Pull that param and same it for later.
  $scope.currentDisplay = parseInt($stateParams.segment);
  $ionicLoading.show({});
  $scope._ = _;
  /*
   * Get all the routes and stops
   */
  function getRoutesAndStops () {
    $scope.routes = [];
    // RouteForage returns a promise, resolve it.
    RouteForage.get().then(function (routes) {
      RouteForage.save(routes);
      $scope.routes = stripDetails(routes);
      redraw();
    });
    /*
    * Nested function for removing stuff we don't need
    * from each route; this makes searching easier!
    */
    function stripDetails (routeList) {
      return _.map(routeList, function (route) {
        return _.pick(route, 'RouteId', 'ShortName', 'LongName', 'Color');
      });
    }
    /* Grab the current position.
     * If we get it, get the list of stops based on that.
     * Otherwise, just get a list of stops.  Avail's purview
     * regarding order.
     */
    $cordovaGeolocation.getCurrentPosition({timeout: 3000}).then(function (position) {
      // Remember, StopsForage returns a Promise.
      // Must resolve it.
      StopsForage.get(position.coords.latitude, position.coords.longitude).then(function (stops) {
        StopsForage.save(stops);
        stops = StopsForage.uniq(stops);
        $scope.stops = prepareStops(stops);
        redraw();
      });
    }, function (err) {
      // If location services fail us, just
      // get a list of stops; ordering no longer matters.
      console.log('error finding position: ' + JSON.stringify(err));
      StopsForage.get().then(function (stops) {
        stops = StopsForage.uniq(stops);
        StopsForage.save(stops);
        $scope.stops = prepareStops(stops);
        redraw();
      });
    });
    /* Similar to prepareRoutes, we only
     * keep the details about each stop that are useful
     * to us for displaying them.  It makes searching easier.
     */
    function prepareStops (list) {
      return _.map(list, function (stop) {
        return _.pick(stop, 'StopId', 'Name');
      });
    }
  }
  // Two variables for the lists.
  $scope.routesDisp = [];
  $scope.stopsDisp = [];

  /* Decides which list to display.
   * Takes an index (0 or 1) and assigns
   * the appropriate variables.
   */
  $scope.display = function (index) {
    /* Set the controller-wide
     * variable to indicate
     * which type of data is being displayed.
     * This is useful when searching.
     */
    $scope.currentDisplay = index;
    /* Fill the $scope variable for
     * the proper list and clear out
     * the ones for the other list.
     */
    switch (index) {
      case 0:
        $scope.stopsDisp = null;
        $scope.routesDisp = $scope.routes;
        break;
      case 1:
        $scope.routesDisp = null;
        $scope.stopsDisp = $scope.stops;
        break;
    }
    // Finally, hide the loader to coax a redraw.
    $ionicLoading.hide();
  };

  /* When the search button is clicked onscreen,
   * this function is called. The library, in the background,
   * takes care of some things for us, like tracking the input text.
   * The key here is to determine whether we're
   * trying to search stops or routes.
   */
  $scope.showFilterBar = function () {
    var itms;
    // itms is the variable we'll be searching.
    // If routes are displayed, imts is routes.
    // Else, it's stops.
    if ($scope.currentDisplay === 0) {
      itms = $scope.routesDisp;
    }
    else {
      itms = $scope.stopsDisp;
    }
    filterBarInstance = $ionicFilterBar.show({
      // tell $ionicFilterBar to search over itms.
      items: itms,
      // Every time the input changes, update the results.
      update: function (filteredItems) {
        // if routes are currently being displayed, update
        // their list with our results here.
        if ($scope.currentDisplay === 0) {
          $scope.routesDisp = filteredItems;
        }
        else {
          // otherwise, update the stops list.
          $scope.stopsDisp = filteredItems;
        }

      }
    });
  };
  function getFavorites () {
    localforage.getItem('favoriteRoutes', function (err, value) {
      $scope.favoriteRoutes = value;
      redraw();
    });
    localforage.getItem('favoriteStops', function (err, value) {
      $scope.favoriteStops = value;
      redraw();
    });
  }

  $scope.showFilters = function() {
    $scope.show ? $scope.show = false : $scope.show = true;
  }

  $scope.orderBy = function(val) {
    if ($scope.currentDisplay === 0) {
      if
    }
  }

  function redraw () {
    $scope.display($scope.currentDisplay);
  }

  $scope.$on('$ionicView.enter', function () {
    getRoutesAndStops();
    getFavorites();
  });
});
