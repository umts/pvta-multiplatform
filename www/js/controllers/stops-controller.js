angular.module('pvta.controllers').controller('StopsController', function ($scope, $resource, Stops, NearestStops, $ionicFilterBar, $cordovaGeolocation, StopsForage) {
  var filterBarInstance;
  $cordovaGeolocation.getCurrentPosition({timeout: 3000}).then(function (position) {
    StopsForage.get(position.coords.latitude, position.coords.longitude).then(function(stops){
      $scope.stops = stops;
      $scope.$apply();
      StopsForage.save(stops);
    });
  }, function(err){
    console.log(JSON.stringify(err));
  });
  $scope.showFilterBar = function () {
    filterBarInstance = $ionicFilterBar.show({
      items: $scope.stops,
      update: function (filteredItems, filterText) {
        $scope.stops = filteredItems;
      }
    });
  };
});