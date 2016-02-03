angular.module('pvta.controllers').controller('SearchController', function($scope, $ionicFilterBar, $resource, RouteList, StopList, Stops){
  var filterBarInstance;
  function getItems () {
    $scope.all = [];
    var prepareRoutes = function(routes){
      for(var i = 0; i < routes.length; i++){
          $scope.all.push({name: "Route " + routes[i].ShortName + ": " + routes[i].LongName,
                          type: 'route',
                          id: routes[i].RouteId
                          });
        if(!routes[i].IsVisible){
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
    }
    if(RouteList.isEmpty()){
      var routes = $resource('http://bustracker.pvta.com/infopoint/rest/routes/getallroutes').query({}, function(){
        routes = prepareRoutes(routes);
        RouteList.pushEntireList(routes);
      });
    }
    else{
      var routes = RouteList.getEntireList();
      routes = prepareRoutes(routes);
    }
    var stops = [];
    if(StopList.isEmpty()){
      stops = Stops.query(function(){
        stops.sort(function(a, b){return a.Name - b.Name})
        StopList.pushEntireList(stops);
        prepareStops(stops);
      });
    }
    else{
      stops = StopList.getEntireList(); 
      for(var id in stops){
        if(stops.hasOwnProperty(id))
        $scope.all.push({name: stops[id].Name,
                        type: 'stop',
                        id: stops[id].StopId
                        });
      }
    }
    var prepareStops = function(list){
      for(var i = 0; i < list.length; i++)
      $scope.all.push({name: list[i].Name,
                        type: 'stop',
                        id: list[i].StopId
                        });
    }
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
	  $scope.filterText = filterText;
          if (filterText!='' && filterText!=null) 
            $scope.display_items = filteredItems;
          else
	    $scope.display_items = [];
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
