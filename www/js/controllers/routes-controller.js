angular.module('pvta.controllers').controller('RoutesController', function($scope, $resource, Routes, RouteList){
  if(RouteList.isEmpty()){
    $scope.routes = Routes.query(function(){
      $scope.routes.sort(function(a, b){return a.ShortName - b.ShortName});
      RouteList.pushEntireList($scope.routes);
    });
  }
  else{
    $scope.routes = RouteList.getEntireList();
  }
})