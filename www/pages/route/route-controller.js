angular.module('pvta.controllers').controller('RouteController', function($scope, $state, $stateParams, $ionicLoading, Route, RouteVehicles, FavoriteRoutes, Messages, $location, $ionicScrollDelegate){
  ga('set', 'page', '/route.html');
  ga('set', 'route', $stateParams.routeId);
  ga('send', 'pageview');

  /*
  * Called when the user performs a pull-to-refresh.  Only downloads
  * vehicle data instead of all route data.
  */
  function getVehicles () {
    $scope.vehicles = RouteVehicles.query({id: $stateParams.routeId}, function () {
    $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $ionicLoading.show({hideOnStateChange: true, duration: 5000});
  /**
   * Download all the details for this route,
   * including the stops and vehicles on it.
   */
  Route.get({ routeId: $stateParams.routeId }, function (route) {
    ga('send', 'event', 'RouteLoaded', 'RouteController.self', 'Route id:' + $stateParams.routeId);
    $scope.route = route
    getHeart();
    $scope.stops = $scope.route.Stops;
    $scope.vehicles = $scope.route.Vehicles;
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
    $scope.messages = filteredMessages;
  });

  // Toggles saving/unsaving this route to Favorites
  $scope.toggleHeart = function(liked) {
    FavoriteRoutes.contains($scope.route, function (bool) {
      if (bool) {
        FavoriteRoutes.remove($scope.route);
      }
      else {
        FavoriteRoutes.push($scope.route);
      }
    });
  };

  var getHeart = function () {
    FavoriteRoutes.contains($scope.route, function (bool) {
      $scope.liked = bool;
    });
  };

  $scope.refresh = function () {
    getVehicles();
  };

  $scope.$on('$ionicView.enter', function () {
    getHeart();
  });
});
