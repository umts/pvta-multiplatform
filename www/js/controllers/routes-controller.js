angular.module('pvta.controllers').controller('RoutesController', function ($scope, $resource, Routes, RouteList, $ionicFilterBar) {
  var filterBarInstance;
  var toSearch;
  if (RouteList.isEmpty()) {
    $scope.routes = Routes.query(function () {
      RouteList.pushEntireList($scope.routes);
      toSearch = _.map($scope.routes, function(route){
        return _.pick(route, 'ShortName', 'LongName', 'Color');
      });
    });
  }
  else {
    $scope.routes = RouteList.getEntireList();
    toSearch = _.map($scope.routes, function(route){
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
