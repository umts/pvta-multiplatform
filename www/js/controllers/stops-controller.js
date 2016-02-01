angular.module('pvta.controllers').controller('StopsController', function($scope, $resource, StopList, Stops, $ionicFilterBar){
  var filterBarInstance;
  if(StopList.isEmpty()){
    $scope.stops = Stops.query(function(){
      $scope.stops.sort(function(a, b){return a.Name - b.Name})
      StopList.pushEntireList($scope.stops);
      for(var stop = 0; stop < $scope.stops.length; stop++) {
        $scope.stops[stop] = {
        Name: $scope.stops[stop].Name,
        StopId: $scope.stops[stop].StopId  
        }
      }
    });
  }
  else{
   $scope.stops = StopList.getEntireList(); 
   for(var stop = 0; stop < $scope.stops.length; stop++) {
     $scope.stops[stop] = {
       Name: $scope.stops[stop].Name,
       StopId: $scope.stops[stop].StopId 
     }
   }
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
