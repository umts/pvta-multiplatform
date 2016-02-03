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
   loaded_stops = StopList.getEntireList(); 
   $scope.stops = [];
   for (var id in loaded_stops){  
     $scope.stops.push({
       Name: loaded_stops[id].Name,
       StopId: loaded_stops[id].StopId 
     })
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
