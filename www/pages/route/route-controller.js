angular.module('pvta.controllers').controller('RouteController', function ($scope, $state, $stateParams, $ionicLoading, Route, RouteVehicles, FavoriteRoutes, Messages, $location, $ionicScrollDelegate, $ionicModal, FavoriteStops, $ionicFilterBar, Helper) {
  ga('set', 'page', '/route.html');
  ga('set', 'route', $stateParams.routeId);
  ga('send', 'pageview');

  $scope.showStopModal = function () {
    $ionicModal.fromTemplateUrl('pages/route/stop-modal.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.stopModal = modal;
      $scope.stopModal.show();
    });
  };

  $scope.toggleStopHeart = function (stop) {
    FavoriteStops.toggleFavoriteStop(stop);
  };

  var getHeart = function () {
    FavoriteRoutes.contains($scope.route, function (bool) {
      $scope.liked = bool;
    });
  };

  /*
  * Called when the user performs a pull-to-refresh.  Only downloads
  * vehicle data instead of all route data.
  */
  function getVehicles () {
    $scope.vehicles = RouteVehicles.query({id: $stateParams.routeId}, function () {
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  $ionicLoading.show({hideOnStateChange: true, duration: 5000});
  /**
   * Download all the details for this route,
   * including the stops and vehicles on it.
   */
  Route.get({ routeId: $stateParams.routeId }, function (route) {
    ga('send', 'event', 'RouteLoaded', 'RouteController.self', 'Route: ' + route.RouteAbbreviation + ' (' + $stateParams.routeId + ')');
    $scope.route = route;
    getHeart();
    prepareStops($scope.route.Stops);
    $scope.vehicles = $scope.route.Vehicles;
    $ionicLoading.hide();
  });

  function prepareStops (stops) {
    $scope.stops = [];
    FavoriteStops.getAll().then(function (favoriteStops) {
      var favoriteStopIds = _.pluck(favoriteStops, 'StopId');
      for (var index = 0; index < stops.length; index++) {
        var stop = stops[index];
        var liked = false;
        // If the ID of the stop in question is in the list of favorite stop IDs
        if (_.contains(favoriteStopIds, stop.StopId)) {
          liked = true;
        }
        $scope.stops.push({StopId: stop.StopId, Description: stop.Description, Liked: liked});
      }
    });
  }
  /**
   * Download any Alerts for the current route
   * and display them.
   */
  Messages.query(function (messages) {
    var filteredMessages = [];
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      if (_.contains(message.Routes, parseInt($stateParams.routeId))) {
        filteredMessages.push(message);
      }
    }
    $scope.messages = filteredMessages;
  });

  $scope.showFilterBar = function () {
    $ionicFilterBar.show({
      container: '.modal',
      // tell $ionicFilterBar to search over itms.
      items: $scope.stops,
      // Every time the input changes, update the results.
      update: function (filteredItems) {
        $scope.stops = filteredItems;
      }
    });
  };

  // Toggles saving/unsaving this route to Favorites
  $scope.toggleHeart = function (liked) {
    FavoriteRoutes.contains($scope.route, function (bool) {
      if (bool) {
        FavoriteRoutes.remove($scope.route);
      }
      else {
        FavoriteRoutes.push($scope.route);
      }
    });
  };

  $scope.refresh = function () {
    getVehicles();
  };

  $scope.redirectToStop = Helper.redirectToStop;

  $scope.$on('$ionicView.enter', function () {
    getHeart();
  });
});
