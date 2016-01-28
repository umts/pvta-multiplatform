angular.module('pvta.controllers').controller('RoutesController', function($scope, $resource, Routes, RouteList, $ionicFilterBar){
  var filterBarInstance;
  
  if(RouteList.isEmpty()){
    $scope.routes = Routes.query(function(){
      RouteList.pushEntireList($scope.routes);
      for(var route = 0; route < $scope.routes.length; route++){
        $scope.routes[route] = {
          LongName: $scope.routes[route].LongName,
          ShortName: $scope.routes[route].ShortName,
          RouteId: $scope.routes[route].RouteId,
          Color: $scope.routes[route].Color,
        }
      }
    });
  }
  else{
    $scope.routes = RouteList.getEntireList();
    for(var route = 0; route < $scope.routes.length; route++){
      $scope.routes[route] = {
        LongName: $scope.routes[route].LongName,
        ShortName: $scope.routes[route].ShortName,
        RouteId: $scope.routes[route].RouteId,
        Color: $scope.routes[route].Color,
      }
    }
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