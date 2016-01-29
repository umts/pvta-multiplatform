angular.module('pvta.services', ['ngResource'])

.factory('Vehicle', function ($resource) {
    return $resource('http://bustracker.pvta.com/infopoint/rest/vehicles/get/:vehicleId');
})

.factory('Route', function ($resource) {
    return $resource('http://bustracker.pvta.com/infopoint/rest/routedetails/get/:routeId');
})

.factory('Routes', function ($resource) {
    return $resource('http://bustracker.pvta.com/infopoint/rest/routes/getvisibleroutes');
})

.factory('Stop', function ($resource) {
    return $resource('http://bustracker.pvta.com/infopoint/rest/stops/get/:stopId');
})

.factory('Stops', function($resource){
    return $resource('http://bustracker.pvta.com/infopoint/rest/stops/getallstops');
})

.factory('RouteVehicles', function($resource){
    return $resource('http://bustracker.pvta.com/infopoint/rest/vehicles/getallvehiclesforroute?routeId=:routeId')
})

.factory('StopDeparture', function ($resource) {
    return $resource('http://bustracker.pvta.com/infopoint/rest/stopdepartures/get/:stopId');
})




.factory('StopList', function(){
  var stopsList = {};
  var pushToList = function(stop){
    var id = stop.StopId
    stopsList[id] = stop;
  };
  var pushEntireList = function(list){
    for(var i = 0; i < list.length; i++){
      var id = list[i].StopId;
      stopsList[id] = list[i];
    }
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
    pushToList: pushToList,
    isEmpty: isEmpty,  
  };
  
})

.factory('RouteList', function(){
  var routesList = [];
  
  var pushToList = function(route){
    routesList.push(route);
  };
  var pushEntireList = function(list){
   routesList = list;
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
    pushToList: pushToList,
    isEmpty: isEmpty,  
  };
  
})

.factory('FavoriteRoutes', function(){
  var routes = [];
  var push = function(route){
    //routes.push(route);
    localforage.getItem('favoriteRoutes', function(err, value){
      var newArray = [];
      if(value !== null) {
        newArray = value;
        newArray.push(route);
      }
      else{
        newArray.push(route);
      }
      console.log(JSON.stringify(newArray));
      console.log("newArray.size");
      localforage.setItem('favoriteRoutes', newArray, function(err, value){
        console.log("SUCCESS!");
        console.log(JSON.stringify(value));
      })  
    })
  };
  
  var getAll = function(){
    var ret = [];
    localforage.getItem('favoriteRoutes', function(err, value){
      
    })
  };
  
  var remove = function(RouteId){
    routes[RouteId] = undefined;
  };
  
  var contains = function(RouteId){
    return (routes[RouteId] === undefined);
  };
  
  return{
    push: push,
    getAll: getAll,
    remove: remove,
    contains: contains
  };
})

.factory('FavoriteStops', function(){
  var stops = [];
  
  var push = function(stop){
    stops[stop.StopId] = stop;
  }
  
  var get = function(StopId){
    return stops[StopId];
  }
  
  var remove = function(StopId){
    stops[StopId] = undefined;
  }
  
  return{
    push: push,
    get: get,
    remove: remove
  };
})


.service('LatLong', function(){
  var latlong = [];
  return {
    push: function(lat, long){
      var p = {lat, long};
      latlong.push(p);
      console.log("LatLong push called" + JSON.stringify(latlong));
    },
    pop: function(){
      var x = latlong.pop();
      console.log("LatLong PULL called" + JSON.stringify(x));
      return x;
    }
  };
});

