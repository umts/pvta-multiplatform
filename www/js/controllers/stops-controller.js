angular.module('pvta.controllers').controller('StopsController', function($scope, $resource, StopList, Stops){
  if(StopList.isEmpty()){
    $scope.stops = Stops.query(function(){
      $scope.stops.sort(function(a, b){return a.Name - b.Name})
      StopList.pushEntireList($scope.stops);
    });
  }
  else{
   $scope.stops = StopList.getEntireList(); 
  }
})