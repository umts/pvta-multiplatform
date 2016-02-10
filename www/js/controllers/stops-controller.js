angular.module('pvta.controllers').controller('StopsController', function($scope, $resource, StopList, Stops, NearestStops, $ionicFilterBar, $cordovaGeolocation){
  $scope.display_message = "No results found.";
  var filterBarInstance;
  if(StopList.isEmpty()){
    $cordovaGeolocation.getCurrentPosition().then(function(position){
      $scope.stops = NearestStops.query({latitude: position.coords.latitude, longitude: position.coords.longitude}, function(){
        StopList.pushEntireList($scope.stops);
      });
    }, function(err) {
      $scope.stops = Stops.query(function(){
        StopList.pushEntireList($scope.stops);
      }); 
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

})
