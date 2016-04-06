angular.module('pvta.controllers').controller('StopsController', function ($scope, $resource, Stops, NearestStops, $ionicFilterBar, $cordovaGeolocation, StopsForage, $ionicLoading) {
  $scope.stops = [];
  $ionicLoading.show({});
  $cordovaGeolocation.getCurrentPosition({timeout: 3000}).then(function (position) {
    StopsForage.get(position.coords.latitude, position.coords.longitude).then(function (stops) {
      stops = StopsForage.uniq(stops);
      $scope.stops = stops;
      $ionicLoading.hide();
      StopsForage.save(stops);
    });
  }, function () {
    StopsForage.get().then(function (stops) {
      stops = StopsForage.uniq(stops);
      $scope.stops = stops;
      $ionicLoading.hide();
      StopsForage.save(stops);
    });
  });
  $scope.showFilterBar = function () {
    $ionicFilterBar.show({
      items: $scope.stops,
      update: function (filteredItems) {
        $scope.stops = filteredItems;
      }
    });
  };
});
