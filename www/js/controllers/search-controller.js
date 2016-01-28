angular.module('pvta.controllers').controller('SearchController', function($scope, $ionicFilterBar, $resource){
  var filterBarInstance;
  function getItems () {
    $scope.all = [];
    var routes = $resource('http://bustracker.pvta.com/infopoint/rest/routes/getallroutes').query({}, function(){
      for(var i = 0; i < routes.length; i++){
        $scope.all.push({name: routes[i].ShortName + ": " + routes[i].LongName,
                        type: 'route',
                        id: routes[i].RouteId
                        });
      }
    });
    var stops = $resource('http://bustracker.pvta.com/infopoint/rest/stops/getallstops').query({}, function(){
      for(var i = 0; i < stops.length; i++){
        $scope.all.push({name: stops[i].Name,
                        type: 'stop',
                        id: stops[i].StopId
                        });
      }
    });
    var vehicles = $resource('http://bustracker.pvta.com/infopoint/rest/vehicles/getallvehicles').query({}, function(){
      for(var i = 0; i < vehicles.length; i++){
        $scope.all.push({name: vehicles[i].Name,
                        type: 'vehicle',
                        id: vehicles[i].VehicleId
                        });
      }
    });
    }
  getItems();
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
