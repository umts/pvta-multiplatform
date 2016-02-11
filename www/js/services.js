angular.module('pvta.services', ['ngResource'])

.factory('Avail', function(){
  return 'http://bustracker.pvta.com/infopoint/rest';
})

.factory('Vehicle', function ($resource, Avail) {
    return $resource(Avail + '/vehicles/get/:vehicleId');
})

.factory('Route', function ($resource, Avail) {
    return $resource(Avail + '/routedetails/get/:routeId');
})

.factory('Routes', function ($resource, Avail) {
    return $resource(Avail + '/routes/getvisibleroutes');
})

.factory('Stop', function ($resource, Avail) {
    return $resource(Avail + '/stops/get/:stopId');
})

.factory('Stops', function ($resource, Avail){
    return $resource(Avail + '/stops/getallstops');
})

.factory('RouteVehicles', function ($resource, Avail){
    return $resource(Avail + '/vehicles/getallvehiclesforroute?routeId=:routeId')
})

.factory('StopDeparture', function ($resource, Avail) {
    return $resource(Avail + '/stopdepartures/get/:stopId');
})

.factory('Messages', function ($resource, Avail) {
  return $resource(Avail + '/publicmessages/getcurrentmessages');
})

.factory('SimpleRoute', function ($resource, Avail){
  return $resource(Avail + '/routes/get/:routeId');
})




.factory('StopList', function(){
  var stopsList = {};

  var pushEntireList = function(list){
    list = _.uniq(list, 'Name');
    list = _.sortBy(list, 'Name');
    _.each(list, function(stop){
      stopsList[stop.StopId] = stop;
    });
    return stopsList;
  };

  var getStopFromList = function(id){
    if(!isEmpty()) return stopsList[id];
    else return 0;
  };
  
  var getEntireList = function(){
    if(stopsList !== undefined){
      return stopsList;
    }
    else return 0;
  }
  
  var isEmpty = function(){
    if(Object.keys(stopsList).length === 0) return true;
    else return false
  };
  
  return {
    pushEntireList: pushEntireList,
    getStopFromList: getStopFromList,
    getEntireList: getEntireList,
    isEmpty: isEmpty,  
  };
  
})

.factory('RouteList', function(){
  var routesList = [];
  
  var pushEntireList = function(list){
   // only store the route attributes we need
   routesList = _.map(list, function(route){
     return _.pick(route, 'ShortName', 'LongName', 'Color', 'RouteId');
   });
   return routesList;
  };

  var getEntireList = function(){
    if(!isEmpty()) {
      return routesList;
    }
    else return 0;
  }
  
  var isEmpty = function(){
    if(routesList.length === 0) return true;
    else return false
  };
  
  return {
    pushEntireList: pushEntireList,
    getEntireList: getEntireList,
    isEmpty: isEmpty,  
  };
  
})

.factory('FavoriteRoutes', function(){
  var routes = [];
  var push = function(route){
    localforage.getItem('favoriteRoutes', function(err, value){
      var newArray = [];
      if(value !== null) {
        newArray = value;
        newArray.push(route);
      }
      else{
        newArray.push(route);
      }
      localforage.setItem('favoriteRoutes', newArray, function(err, value){
      })  
    })
  };
  
  var getAll = function(){
    var ret = [];
    localforage.getItem('favoriteRoutes', function(err, value){
      
    })
  };
  
  var remove = function(route){
    localforage.getItem('favoriteRoutes', function(err, routes){
      for(var i = 0; i < routes.length; i++){
        if(routes[i].RouteId === route.RouteId) {
          routes.splice(i, 1);
        }
      }
      localforage.setItem('favoriteRoutes', routes, function(err, newRoutes){
      });
    });
    removeOneRoute(route);
  };
  
  var removeOneRoute = function(route){
    var name = 'Route ' + route.ShortName + ' favorite';
    localforage.removeItem(name, function(err){
      if(err) console.log(err);
    });
  };
  
  return{
    push: push,
    getAll: getAll,
    remove: remove
  };
})

.factory('FavoriteStops', function(){
  var stops = [];
  var push = function(stop){
    localforage.getItem('favoriteStops', function(err, value){
      var newArray = [];
      if(value !== null) {
        newArray = value;
        newArray.push(stop);
      }
      else{
        newArray.push(stop);
      }
      localforage.setItem('favoriteStops', newArray, function(err, value){
      });  
    });
  };
  
  var getAll = function(){
    var ret = [];
    localforage.getItem('favoriteStops', function(err, value){
    });
  };
  
  var remove = function(stop){
    localforage.getItem('favoriteStops', function(err, stops){
      for(var i = 0; i < stops.length; i++){
        if(stops[i].StopId === stop.StopId) {
          stops.splice(i, 1);
        }
      }
      localforage.setItem('favoriteStops', stops, function(err, newStops){
      });
    });
    
    //Since stops also have their own separate entries,
    // (for toggling the heart on the Stop's page),
    // remove that too.
    removeOneStop(stop);
  };
  
  var removeOneStop = function(stop){
    var name = 'Stop ' + stop.Name + " favorite";
    localforage.removeItem(name, function(err){
      if(err) console.log(err);
    });
  }
  
  return{
    push: push,
    getAll: getAll,
    remove: remove
  };
})

.service('LatLong', function(){
  var latlong = [];
  return {
    push: function(lat, long){
      var p = {lat, long};
      latlong.push(p);
    },
    pop: function(){
      var x = latlong.pop();
      return x;
    }
  };
});

