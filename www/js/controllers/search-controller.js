angular.module('pvta.controllers').controller('SearchController', function ($scope, $ionicFilterBar, $resource, $cordovaGeolocation, RouteList, NearestStops, Avail, Recent, RouteForage, StopsForage, $ionicLoading) {
  var filterBarInstance;
  function getItems () {
    $scope.all = [];
    var prepareRoutes = function (routes) {
      for (var i = 0; i < routes.length; i++) {
        $scope.all.push({name: 'Route ' + routes[i].ShortName + ': ' + routes[i].LongName,
                          type: 'route',
                          id: routes[i].RouteId
                          });
        if (!routes[i].IsVisible) {
          routes.splice(i, 1);
          /********************************************
           * Because splice() removes the entry at
           * the current index and slides all others
           * to the left, we must ***decrement i*** so that
           * we don't miss adding a route that ocurrs
           * immediately AFTER a non-visible route to
           * $scope.all.
           ********************************************/
          i--;
        }
      }
      return routes;
    };
    RouteForage.get().then(function (routes) {
      RouteForage.save(routes);
      prepareRoutes(routes);
    });
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

    function prepareStops (list) {
      for (var i = 0; i < list.length; i++) {
        $scope.all.push({name: list[i].Name,
                        type: 'stop',
                        id: list[i].StopId
                        });
      }
    }
  }
  getItems();
  $scope.showFilterBar = function () {
    filterBarInstance = $ionicFilterBar.show({
      items: $scope.all,
      update: function (filteredItems, filterText) {
        if (filterText !== '' && filterText !== null) {
          $scope.displayItems = filteredItems;
          $scope.filterText = filterText;
        }
        else {
          $scope.displayItems = [];
        }
      },
      cancel: function () {
        $scope.displayItems = [];
      }
    });
  };
});
