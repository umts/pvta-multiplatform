function RoutesAndStopsController ($scope, $ionicFilterBar, $cordovaGeolocation, RouteForage, StopsForage, $ionicLoading, $stateParams) {
  ga('set', 'page', '/routes-and-stops.html');
  ga('send', 'pageview');
  var self = this;
  // We can control which list is shown via the page's URL.
  // Pull that param and same it for later.
  self.currentDisplay = parseInt($stateParams.segment);
  $ionicLoading.show({});
  self._ = _;
  /*
   * Get all the routes and stops
   */
  function getRoutesAndStops () {
    self.routes = [];
    // RouteForage returns a promise, resolve it.
    RouteForage.get().then(function (routes) {
      RouteForage.save(routes);
      self.routes = stripDetails(routes);
      redraw();
    });
    /*
    * Nested function for removing stuff we don't need
    * from each route; this makes searching easier!
    */
    function stripDetails (routeList) {
      return _.map(routeList, function (route) {
        return _.pick(route, 'RouteId', 'RouteAbbreviation', 'LongName', 'ShortName', 'Color');
      });
    }
    // Remember, StopsForage returns a Promise.
    // Must resolve it.
    StopsForage.get().then(function (stops) {
      stops = StopsForage.uniq(stops);
      self.stops = prepareStops(stops);
      StopsForage.save(stops);
      redraw();
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
  self.routesDisp = [];
  self.stopsDisp = [];

  /* Decides which list to display.
   * Takes an index (0 or 1) and assigns
   * the appropriate variables.
   */
  self.display = function (index) {
    /* Set the controller-wide
     * variable to indicate
     * which type of data is being displayed.
     * This is useful when searching.
     */
    self.currentDisplay = index;
    /* Fill the $scope variable for
     * the proper list and clear out
     * the ones for the other list.
     */
    switch (index) {
      case 0:
        self.stopsDisp = null;
        self.routesDisp = self.routes;
        break;
      case 1:
        self.routesDisp = null;
        self.stopsDisp = self.stops.slice(0, 41);
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
  self.showFilterBar = function () {
    var itms;
    // itms is the variable we'll be searching.
    // If routes are displayed, imts is routes.
    // Else, it's stops.
    if (self.currentDisplay === 0) {
      itms = self.routesDisp;
    }
    else {
      itms = self.stops;
    }
    filterBarInstance = $ionicFilterBar.show({
      // tell $ionicFilterBar to search over itms.
      items: itms,
      // Every time the input changes, update the results.
      update: function (filteredItems) {
        // if routes are currently being displayed, update
        // their list with our results here.
        if (self.currentDisplay === 0) {
          self.routesDisp = filteredItems;
        }
        else {
          // otherwise, update the stops list.
          self.stopsDisp = filteredItems.slice(0, 41);
        }

      }
    });
  };
  function getFavorites () {
    localforage.getItem('favoriteRoutes', function (err, value) {
      self.favoriteRoutes = value;
      redraw();
    });
    localforage.getItem('favoriteStops', function (err, value) {
      self.favoriteStops = value;
      redraw();
    });
  }

  function redraw () {
    self.display(self.currentDisplay);
  }
  getRoutesAndStops();
  $scope.$on('$ionicView.enter', function () {
    getFavorites();
  });
}
angular.module('pvta.controllers').controller('RoutesAndStopsController', RoutesAndStopsController);
RoutesAndStopsController.$inject = ['$scope', "$ionicFilterBar", "$cordovaGeolocation", 'RouteForage', 'StopsForage', '$ionicLoading', '$stateParams'];
