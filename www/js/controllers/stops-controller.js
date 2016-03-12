angular.module('pvta.controllers').controller('StopsController', function ($scope, $resource, Stops, NearestStops, $ionicFilterBar, $cordovaGeolocation, StopsForage) {
  $scope.display_message = 'No results found.';
  var filterBarInstance;

  $cordovaGeolocation.getCurrentPosition().then(function (position) {
    StopsForage.get(position.coords.latitude, position.coords.longitude).then(function(stops){
      $scope.stops = stops;
      StopsForage.save(stops);
    });
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
