angular.module('pvta.controllers').controller('MyBusesController', function($scope, FavoriteRoutes){
  $scope.routes = FavoriteRoutes.getAll();
  console.log(JSON.stringify($scope.routes));
  $scope.stops = [];
})