angular.module('pvta.controllers').controller('StopsController', function($scope, $resource, StopList, Stops, MyLocation, $ionicFilterBar, $cordovaGeolocation){
  MyLocation.calculateLocation();
  $scope.display_message = "No results found.";
  var filterBarInstance;
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
