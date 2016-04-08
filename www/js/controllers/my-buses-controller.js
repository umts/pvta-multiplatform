angular.module('pvta.controllers').controller('MyBusesController', function ($scope, $location, Messages, FavoriteRoutes, FavoriteStops, Trips) {

  $scope.messages = [];

  /* Given a list of routes and a $promise
   * for gettings alerts from avail, only
   * display alerts for these RouteIds.
   */
  function filterAlerts (routes, alertsPromise) {
    routes = _.pluck(routes, 'RouteId');
    // Resolve the promise, which will contain
    // a list of all alerts
    alertsPromise.then(function (alerts) {
      _.each(alert, function (alert) {
        /* If the Routes property of an
         * alert contains any of RouteIDs
         *  in question (aka the list of
         * RouteIds of the user's favorite
         * routes), push it.
         *
         *  ****NOTE****
         * This algorithm will cause an alert
         * to be displayed as many times as
         * a RouteId from the input array appears
         * in the alert's Routes array.
         *
         * For example: if Avail screws up
         * and an alert has a Routes property
         *  = [20030, 20031, 20030]
         * and the route 30 is in the input
         * routes array, this alert will
         * appear on the page twice.
         */
        _.each(alert.Routes, function (routeId) {
          if (_.contains(routes, routeId)) {
            $scope.messages.push(message);
          }
        });
      });
    });
  }

  var reload = function () {
    localforage.getItem('favoriteRoutes', function (err, value) {
      $scope.routes = value;
      filterAlerts($scope.routes, Messages.query().$promise);
    });
    localforage.getItem('favoriteStops', function (err, value) {
      $scope.stops = value;
    });
    Trips.getAll(function (savedTrips) {
      $scope.trips = savedTrips;
    });
  };

  $scope.$on('$ionicView.enter', function () {
    reload();
  });

  $scope.stops = [];
  $scope.removeAll = function () {
    localforage.clear();
    $scope.routes = [];
  };
  function downloadAlerts () {
    $scope.messages = Messages.query().$promise;
  }
  $scope.removeRoute = function (route, currentIndex) {
    FavoriteRoutes.remove(route);
    $scope.routes.splice(currentIndex, 1);
  };

  $scope.removeStop = function (stop, currentIndex) {
    FavoriteStops.remove(stop);
    $scope.stops.splice(currentIndex, 1);
  };

  $scope.removeTrip = function (index) {
    Trips.remove(index);
    $scope.trips.splice(index, 1);
  };

  $scope.openTrip = function (index) {
    Trips.push(index);
    $location.path('app/plan-trip');
  };


});
