angular.module('pvta.controllers').controller('MyBusesController', function ($scope, Messages, FavoriteRoutes, FavoriteStops) {
  $scope.$on('$ionicView.enter', function (e) {
    reload();
  })
  var reload = function () {
    localforage.getItem('favoriteRoutes', function (err, value) {
      $scope.routes = value;
    });
    localforage.getItem('favoriteStops', function (err, value) {
      $scope.stops = value;
    });
  };

  $scope.stops = [];
  $scope.removeAll = function () {
    localforage.clear();
    $scope.routes = [];
  };

  $scope.messages = Messages.query();

  $scope.removeRoute = function (route, currentIndex) {
    FavoriteRoutes.remove(route);
    $scope.routes.splice(currentIndex, 1);
  };

  $scope.removeStop = function (stop, currentIndex) {
    FavoriteStops.remove(stop);
    $scope.stops.splice(currentIndex, 1);
  };
});
