function RouteController ($scope, $state, $stateParams, $ionicLoading, Route, RouteVehicles, FavoriteRoutes, Messages, $location, $ionicScrollDelegate){
  ga('set', 'page', '/route.html');
  ga('send', 'pageview');
  var self = this;
  /*
  * Called when the user performs a pull-to-refresh.  Only downloads
  * vehicle data instead of all route data.
  */
  function getVehicles () {
    self.vehicles = RouteVehicles.query({id: $stateParams.routeId}, function () {
    $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $ionicLoading.show({hideOnStateChange: true, duration: 5000});
  /**
   * Download all the details for this route,
   * including the stops and vehicles on it.
   */
  Route.get({routeId: $stateParams.routeId}, function(route) {
    self.route = route
    getHeart();
    self.stops = self.route.Stops;
    self.vehicles = self.route.Vehicles;
    $ionicLoading.hide();
  });
  /**
   * Download any Alerts for the current route
   * and display them.
   */
  Messages.query(function (messages) {
    var filteredMessages = [];
    for (var message of messages) {
      if (_.contains(message.Routes, parseInt($stateParams.routeId))) {
        filteredMessages.push(message);
      }
    }
    self.messages = filteredMessages;
  });

  // Toggles saving/unsaving this route to Favorites
  self.toggleHeart = function(liked) {
    FavoriteRoutes.contains(self.route, function (bool) {
      if (bool) {
        FavoriteRoutes.remove(self.route);
      }
      else {
        FavoriteRoutes.push(self.route);
      }
    });
  };

  var getHeart = function () {
    FavoriteRoutes.contains(self.route, function (bool) {
      self.liked = bool;
    });
  };

  self.refresh = function () {
    getVehicles();
  };

  $scope.$on('$ionicView.enter', function () {
    getHeart();
  });
}
angular.module('pvta.controllers').controller('RouteController', RouteController);
RouteController.$inject = ['$scope', '$state', '$stateParams', '$ionicLoading', 'Route', 'RouteVehicles', 'FavoriteRoutes', 'Messages', "$location", '$ionicScrollDelegate'];
