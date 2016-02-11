angular.module('pvta.controllers').controller('RoutesController', function($scope, $resource, Routes, RouteList, $ionicFilterBar){
  var filterBarInstance;
  if(RouteList.isEmpty()){
    $scope.routes = Routes.query(function(){
      RouteList.pushEntireList($scope.routes);
    });
  }
  else{
    $scope.routes = RouteList.getEntireList();
  }
  
  $scope.showFilterBar = function () {
    filterBarInstance = $ionicFilterBar.show({
      items: $scope.routes,
      update: function (filteredItems, filterText) {
	    $scope.routes = filteredItems;
      }
    });
  };
})
