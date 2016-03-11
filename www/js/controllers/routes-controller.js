angular.module('pvta.controllers').controller('RoutesController', function ($scope, $resource, Routes, RouteList, $ionicFilterBar) {
  var filterBarInstance;
  var toSearch;
  if (RouteList.isEmpty()) {
    $scope.routes = Routes.query(function () {
      RouteList.pushEntireList($scope.routes);
      toSearch = stripDetails($scope.routes);
    });
  }
  else {
    $scope.routes = RouteList.getEntireList();
    toSearch = stripDetails($scope.routes);
  }

  function stripDetails(routeList){
    return _.map(routeList, function(route){
        return _.pick(route, 'ShortName', 'LongName', 'Color');
    });
  }
  
  $scope.showFilterBar = function () {
    filterBarInstance = $ionicFilterBar.show({
      items: toSearch,
      update: function (filteredItems, filterText) {
        $scope.routes = filteredItems;
      }
    });
  };
});
