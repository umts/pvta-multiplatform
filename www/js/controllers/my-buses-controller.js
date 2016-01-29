angular.module('pvta.controllers').controller('MyBusesController', function($scope, FavoriteRoutes){
  localforage.getItem('favoriteRoutes', function(err, value){
      $scope.routes = value;
    })
  $scope.$on('$ionicView.enter', function(e){
    localforage.getItem('favoriteRoutes', function(err, value){
      $scope.routes = value;
      console.log(JSON.stringify($scope.routes));
    })
  }) 
  $scope.stops = [];
  $scope.removeAll = function(){
    localforage.clear();
  };
})