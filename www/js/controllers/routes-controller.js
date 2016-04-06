angular.module('pvta.controllers').controller('RoutesController', function ($scope, $resource, Routes, RouteList, $ionicFilterBar, RouteForage, $ionicLoading) {
  var filterBarInstance;
  $ionicLoading.show({});
  RouteForage.get().then(function (routes) {
    RouteForage.save(routes);
    $scope.routes = stripDetails(routes);
    $ionicLoading.hide();
  });
  function stripDetails (routeList) {
    return _.map(routeList, function (route) {
      return _.pick(route, 'RouteId', 'ShortName', 'LongName', 'Color');
    });
  }
  $scope.showFilterBar = function () {
    filterBarInstance = $ionicFilterBar.show({
      items: $scope.routes,
      update: function (filteredItems, filterText) {
        $scope.routes = filteredItems;
      }
    });
  };
});
