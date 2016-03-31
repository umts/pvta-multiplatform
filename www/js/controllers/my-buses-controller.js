angular.module('pvta.controllers').controller('MyBusesController', function ($scope, $location, Messages, FavoriteRoutes, FavoriteStops, Trips) {
  var reload = function () {
    localforage.getItem('favoriteRoutes', function (err, value) {
      $scope.routes = value;
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

  $scope.messages = Messages.query();

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
