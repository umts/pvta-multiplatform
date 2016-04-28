angular.module('pvta.controllers').controller('RoutesAndStopsController', function ($scope, $ionicFilterBar, $resource, $cordovaGeolocation, RouteList, NearestStops, Avail, Recent, RouteForage, StopsForage, $ionicLoading, $stateParams) {
  var filterBarInstance;
  // We can control which list is shown via the page's URL.
  // Pull that param and same it for later.
  var currentDisplay = parseInt($stateParams.segment);
  $ionicLoading.show({});
  // One variable for everything
  $scope.all = [];
  /*
   * Get all the routes and stops
   */
  function getItems () {
    $scope.routes = [];
    // RouteForage returns a promise, resolve it.
    RouteForage.get().then(function (routes) {
      RouteForage.save(routes);
      $scope.routes = stripDetails(routes);
      $scope.all.push($scope.routes);
      $scope.display(currentDisplay);
    });
    /*
    * Nested function for removing stuff we don't Nested
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
        prepareStops(stops);
      });
    }, function (err) {
      // If location services fail us, just
      // get a list of stops; ordering no longer matters.
      console.log('error finding position: ' + JSON.stringify(err));
      StopsForage.get().then(function (stops) {
        stops = StopsForage.uniq(stops);
        StopsForage.save(stops);
        prepareStops(stops);
      });
    });
    $scope.stops = [];
    /* Similar to prepareRoutes, we Only
     * keep the details about each stop that are useful
     * to us for displaying them.  It makes searching easier.
     */
    function prepareStops (list) {
      for (var i = 0; i < list.length; i++) {
        $scope.stops.push({name: list[i].Name,
                        type: 'stop',
                        id: list[i].StopId
                        });
      }
      // Add the newly prepared Stops list to
      // the list of everything.
      $scope.all.push($scope.stops);
    }
  }
  /* Decides which list to display.
   * Takes an index (0 or 1) and calls
   * the proper function that will
   * throw a list onto the screen.
   */
  $scope.display = function (index) {
    switch (index) {
      case 0:
        displayRoutes();
        break;
      case 1:
        displayStops();
        break;
      case 3:
        displayAll();
        break;
    }
  };
  // Two variables for the lists.
  $scope.routesDisp = [];
  $scope.stopsDisp = [];


  /* Fill the $scope variable for
   * the route list and clear out
   * the ones for the stop list.
   * Finally, hide the loader to coax
   * a redraw.
   */
  function displayRoutes () {
    // Set the controller-wide
    // variable to indicate
    // that routes are being displayed.
    // This is useful when searching.
    currentDisplay = 0;
    $scope.stopsDisp = null;
    $scope.routesDisp = $scope.routes;
    $ionicLoading.hide();
  }
  /* See displayRoutes()
   */
  function displayStops () {
    currentDisplay = 1;
    $scope.routesDisp = null;
    $scope.stopsDisp = $scope.stops;
    $ionicLoading.hide();
  }

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
    if (currentDisplay === 0)
      itms = $scope.routesDisp;
    else itms = $scope.stopsDisp;
    filterBarInstance = $ionicFilterBar.show({
      // tell $ionicFilterBar to search over itms.
      items: itms,
      // Every time the input changes, update the results.
      update: function (filteredItems, filterText) {
        // if routes are currently being displayed, update
        // their list with our results here.
        if (currentDisplay === 0)
          $scope.routesDisp = filteredItems;
        else
        // otherwise, update the stops list.
        $scope.stopsDisp = filteredItems;
      }
    });
  };
  getItems();
});
