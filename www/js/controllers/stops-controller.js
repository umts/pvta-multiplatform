angular.module('pvta.controllers').controller('StopsController', function ($scope, $resource, Stops, NearestStops, $ionicFilterBar, $cordovaGeolocation, StopsForage) {
  $cordovaGeolocation.getCurrentPosition({timeout: 3000}).then(function (position) {
    StopsForage.get(position.coords.latitude, position.coords.longitude).then(function (stops) {
      $scope.stops = stops;
      $scope.$apply();
      StopsForage.save(stops);
    });
  }, function () {
    StopsForage.get().then(function (stops) {
      $scope.stops = stops;
      StopsForage.save(stops);
    });
  });
  $scope.showFilterBar = function () {
    $ionicFilterBar.show({
      items: $scope.stops,
      update: function (filteredItems, filterText) {
        $scope.stops = filteredItems;
      }
    });
  };
});
