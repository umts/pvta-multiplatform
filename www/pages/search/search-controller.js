angular.module('pvta.controllers').controller('SearchController', function ($scope, $ionicFilterBar, $resource, $cordovaGeolocation, RouteList, NearestStops, Avail, Recent, RouteForage, StopsForage, $ionicLoading) {
  var filterBarInstance;
  function getItems () {
    $scope.routes = [];
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
    $ionicLoading.show({});
    $cordovaGeolocation.getCurrentPosition({timeout: 3000}).then(function (position) {
      StopsForage.get(position.coords.latitude, position.coords.longitude).then(function (stops) {
        StopsForage.save(stops);
        stops = StopsForage.uniq(stops);
        $ionicLoading.hide();
        prepareStops(stops);
      });
    }, function (err) {
      console.log('error finding position: ' + JSON.stringify(err));
      StopsForage.get().then(function (stops) {
        stops = StopsForage.uniq(stops);
        StopsForage.save(stops);
        prepareStops(stops);
        $ionicLoading.hide();
      });
    });
    $scope.stops = [];
    function prepareStops (list) {
      for (var i = 0; i < list.length; i++) {
        $scope.stops.push({name: list[i].Name,
                        type: 'stop',
                        id: list[i].StopId
                        });
      }
    }
  }
  getItems();
  $scope.disp = [];
  $scope.display = function (index) {
    switch (index) {
      case 0:
        displayRoutes();
        break;
      case 1:
        displayStops();
        break;
      default:
      console.log(index);
      break;
    }
  }
  function displayRoutes () {
    console.log('routes');
    console.log(JSON.stringify($scope.routes));
    $scope.stopsDisp = null;
    $scope.routesDisp = $scope.routes;
    $scope.$apply();
  }
  function displayStops () {
    $scope.routesDisp = null;
    $scope.stopsDisp = $scope.stops;
    $scope.$apply();
  }
  $scope.showFilterBar = function () {
    filterBarInstance = $ionicFilterBar.show({
      items: $scope.routesDisp,
      update: function (filteredItems, filterText) {
        $scope.routesDisp = filteredItems;
      }
    });
  };
  // $scope.showFilterBar = function () {
  //   itm = $scope.routesDisp
  //   filterBarInstance = $ionicFilterBar.show({
  //     items: $scope.route,
  //     update: function (filteredItems, filterText) {
  //       if (filterText !== '' && filterText !== null) {
  //         itm = filteredItems;
  //         $scope.filterText = filterText;
  //       }
  //       else {
  //         itm = [];
  //       }
  //     },
  //     cancel: function () {
  //       itm = [];
  //     }
  //   });
  // };
});
