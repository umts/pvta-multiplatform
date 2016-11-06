function MyBusesController ($scope, $location, Messages, FavoriteRoutes, FavoriteStops, Trips, $ionicPopup, Info) {
  ga('set', 'page', '/my-buses.html');
  ga('send', 'pageview');
  var self = this;
  self.messages = [];

  /* Given a list of routes and a $promise
   * for gettings alerts from avail, only
   * display alerts for these RouteIds.
   */
  function filterAlerts (routes, alertsPromise) {
    self.messages = [];
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
      self.messages = _.uniq(messages, function (message) {
        return message.MessageId;
      });
    });
  }

  var reload = function () {
    localforage.getItem('updatedRoutes', function (err, updated) {
      if (!updated) {
        localforage.removeItem('routes');
        localforage.removeItem('favoriteRoutes');
        localforage.setItem('updatedRoutes', true);
        self.routes = [];
      } else {
        localforage.getItem('favoriteRoutes', function (err, value) {
          self.routes = value;
          filterAlerts(self.routes, Messages.query().$promise);
        });
      }
    });
    self.stops = 'tits'
    localforage.getItem('favoriteStops', function (err, value) {
    $scope.$apply(function(){
      self.stops = value;
     });

      console.log(JSON.stringify(self.stops))
    });
    Trips.getAll(function (savedTrips) {
      self.trips = savedTrips;
    });
  };

  self.stops = [];
  self.removeAll = function () {
    localforage.clear();
    self.routes = [];
  };

  self.removeRoute = function (route, currentIndex) {
    FavoriteRoutes.remove(route);
    self.routes.splice(currentIndex, 1);
  };

  self.removeStop = function (stop, currentIndex) {
    FavoriteStops.remove(stop);
    self.stops.splice(currentIndex, 1);
  };

  self.removeTrip = function (index) {
    Trips.remove(index);
    self.trips.splice(index, 1);
  };

  self.openTrip = function (index) {
    Trips.push(index);
    $location.path('app/plan-trip');
  };
  // Try to show the popup only when the controller is initially loaded;
  // no need to check every time the user comes to My Buses in the same session
  //showPopup();
  console.log('controller instantiation');
  Info.showPopups()
  // Reload the list of favorites and their respective alerts
  $scope.$on('$ionicView.enter', function () {
    reload();
    console.log('view enter');
  });
};
angular.module('pvta.controllers').controller('MyBusesController', MyBusesController);
MyBusesController.$inject = ['$scope', '$location', 'Messages', 'FavoriteRoutes', 'FavoriteStops', 'Trips', '$ionicPopup', 'Info'];
