angular.module('pvta.controllers').controller('StopsController', function ($scope, $resource, StopList, Stops, NearestStops, $ionicFilterBar, $cordovaGeolocation) {
  $scope.display_message = 'No results found.';
  var filterBarInstance;
  if (StopList.isEmpty()) {
    $cordovaGeolocation.getCurrentPosition().then(function (position) {
      NearestStops.query({latitude: position.coords.latitude, longitude: position.coords.longitude}, function (stops) {
        $scope.stops = StopList.pushEntireList(stops);
      });
    }, function (err) {
      Stops.query(function (stops) {
        $scope.stops = StopList.pushEntireList(stops);
      });
    });
  }
  else {
    $scope.stops = StopList.getEntireList();
  }

  $scope.showFilterBar = function () {
    filterBarInstance = $ionicFilterBar.show({
      items: $scope.stops,
      update: function (filteredItems, filterText) {
        $scope.stops = filteredItems;
      }
    });
  };

});
