angular.module('pvta.controllers').controller('SearchController', function($scope, $ionicFilterBar, $resource, $cordovaGeolocation, RouteList, StopList, Stops, NearestStops, Avail){
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
        // get the routelist from localforage
      localforage.getItem('routes', function(routes){
        // If the routelist exists already and
        // it has been updated recently
        console.log("got routes form localforage");
        if(routes && (Time.recent(routes.time))){
          console.log('we have recent routes yay');
          routes = prepareRoutes(routes.list);
          RouteList.pushEntireList(routes);
        }
        // If a recently updated list can't be found
        // anywhere, time to download it.
        else {
          var routes = $resource(Avail + '/routes/getallroutes').query({}, function(){
            var toForage = {
              list: routes,
              time: moment()
            };
            localforage.setItem('routes', toForage, function(err, val){
              if (err) console.log(err);
              else console.log("successfully set routes");
            });
            routes = prepareRoutes(routes);
            RouteList.pushEntireList(routes);
          });    
        }
      });    
    }
    else{
      var routes = RouteList.getEntireList();
      routes = prepareRoutes(routes);
    }
    if(StopList.isEmpty()){
      $cordovaGeolocation.getCurrentPosition().then(function(position){
        NearestStops.query({latitude: position.coords.latitude, longitude: position.coords.longitude}, function(stops){
          prepareStops(StopList.pushEntireList(stops));
        });
      }, function(err) {
        Stops.query(function(stops) {
          prepareStops(StopList.pushEntireList(stops));
        });
      });
    }
    else{
      prepareStops(StopList.getEntireList());
    }
    function prepareStops(list){
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
})
