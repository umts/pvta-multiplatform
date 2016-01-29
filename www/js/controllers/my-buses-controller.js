angular.module('pvta.controllers').controller('MyBusesController', function($scope, Messages, FavoriteRoutes, FavoriteStops){
  $scope.$on('$ionicView.enter', function(e){
    reload();
  }) 
  
  var reload = function(){
    localforage.getItem('favoriteRoutes', function(err, value){
      $scope.routes = value;
      //console.log(JSON.stringify($scope.routes));
    });
    localforage.getItem('favoriteStops', function(err, value){
      $scope.stops = value;
      console.log(JSON.stringify($scope.stops));
    })
    
  };
  
  $scope.stops = [];
  $scope.removeAll = function(){
    localforage.clear();
    reload();
  };
  
  $scope.messages = Messages.query();
  
  $scope.removeRoute = function(route){
    FavoriteRoutes.remove(route.RouteId);
    reload();
  }
  
  $scope.removeStop = function(stop){
    FavoriteStops.remove(stop.StopId);
    reload();
  }
  
})