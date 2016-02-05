angular.module('pvta.controllers').controller('StopsController', function($scope, $resource, StopList, Stops, MyLocation, $ionicFilterBar, $cordovaGeolocation){
  var filterBarInstance;
  MyLocation.calculateLocation();
  if(StopList.isEmpty()){
    $scope.stops = Stops.query(function(){
      StopList.pushEntireList($scope.stops);
    });
  }
  else{
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

  $scope.distanceFromHere = function(stop) {
    return MyLocation.getDistanceFrom(stop.Latitude, stop.Longitude);
  };


})
