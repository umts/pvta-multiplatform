angular.module('pvta.controllers').controller('MyBusesController', function($scope, Messages, FavoriteRoutes, FavoriteStops, MyLocation){
  $scope.$on('$ionicView.enter', function(e){
    reload();
  }) 
  var reload = function(){
    MyLocation.calculateLocation();
    localforage.getItem('favoriteRoutes', function(err, value){
      $scope.routes = value;
    });
    localforage.getItem('favoriteStops', function(err, value){
      $scope.stops = value;
    });
  };
  
  $scope.stops = [];
  $scope.removeAll = function(){
    localforage.clear();
    reload();
  };
  
  $scope.messages = Messages.query();
  
  $scope.removeRoute = function(route){
    FavoriteRoutes.remove(route);
    reload();
  };
  
  $scope.removeStop = function(stop){
    FavoriteStops.remove(stop);
    reload();
  };
})
