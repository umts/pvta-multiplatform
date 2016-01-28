angular.module('pvta.controllers').controller('RoutesController', function($scope, $resource, Routes, RouteList){
  if(RouteList.isEmpty()){
    $scope.routes = Routes.query(function(){
      RouteList.pushEntireList($scope.routes);
    });
  }
  else{
    $scope.routes = RouteList.getEntireList();
  }
})