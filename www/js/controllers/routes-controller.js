angular.module('pvta.controllers').controller('RoutesController', function($scope, $resource, Routes, RouteList, $ionicFilterBar){
  var filterBarInstance;
  
  if(RouteList.isEmpty()){
    $scope.all = Routes.query(function(){
      RouteList.pushEntireList($scope.all);
      for(var route = 0; route < $scope.all.length; route++){
        $scope.all[route] = {
          LongName: $scope.all[route].LongName,
          ShortName: $scope.all[route].ShortName,
          RouteId: $scope.all[route].RouteId,
          Color: $scope.all[route].Color,
        }
      }
    });
  }
  else{
    $scope.all = RouteList.getEntireList();
  }
  
  $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.all,
        update: function (filteredItems, filterText) {
          $scope.all = filteredItems;
        }
      });
    };
  $scope.refreshItems = function () {
      if (filterBarInstance) {
        filterBarInstance();
        filterBarInstance = null;
      }

      $timeout(function () {
        getItems();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };
  
})