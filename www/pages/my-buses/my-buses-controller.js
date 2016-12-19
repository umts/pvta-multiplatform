angular.module('pvta.controllers').controller('MyBusesController', function ($scope, $location, Messages, FavoriteRoutes, FavoriteStops, Trips, $ionicPopup, Info) {
  ga('set', 'page', '/my-buses.html');
  ga('send', 'pageview');
  $scope.messages = [];


  /* Given a list of routes and a $promise
   * for gettings alerts from avail, only
   * display alerts for these RouteIds.
   */
  function filterAlerts (routes, alertsPromise) {
    $scope.messages = [];
    routes = _.pluck(routes, 'RouteId');
    // Resolve the promise, which will contain
    // a list of all alerts
    alertsPromise.then(function (alerts) {
      var messages = [];
      _.each(alerts, function (alert) {
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

         //Also if there are no routes for that alert , show it by default
        if (alert.Routes.length == 0) {
          messages.push(alert);
        }

        else {
          _.each(alert.Routes, function (routeId) {
            if (_.contains(routes, routeId)) {
              messages.push(alert);
            }
          });
        }
      });
      // Finally, remove any duplicates.  Use the ID of the alert to
      // determine whether we've encountered a duplicate.
      $scope.messages = _.uniq(messages, function (message) {
        return message.MessageId;
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

  $scope.stops = [];
  $scope.removeAll = function () {
    localforage.clear();
    $scope.routes = [];
  };

  $scope.removeRoute = function (route) {
    FavoriteRoutes.remove(route);
    $scope.routes.splice($scope.routes.indexOf(route), 1);
  };

  $scope.removeStop = function (stop) {
    FavoriteStops.remove(stop);
    $scope.stops.splice($scope.stops.indexOf(stop), 1);
  };

  $scope.removeTrip = function (index) {
    Trips.remove(index);
    $scope.trips.splice(index, 1);
  };

  $scope.openTrip = function (index) {
    Trips.push(index);
    $location.path('app/plan-trip');
  };

  // Try to show the popup only when the controller is initially loaded;
  // no need to check every time the user comes to My Buses in the same session
  //showPopup();
  Info.showPopups();
  Info.performMigrations();
  // Reload the list of favorites and their respective alerts
  $scope.$on('$ionicView.enter', function () {
    reload();
  });
});
