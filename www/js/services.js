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
  
  var remove = function(routeId){
    localforage.getItem('favoriteRoutes', function(err, routes){
      for(var i = 0; i < routes.length; i++){
        if(routes[i].RouteId === routeId) {
          routes.splice(i, 1);
        }
      }
      localforage.setItem('favoriteRoutes', routes, function(err, newRoutes){
      })
    })
    
  };
  
  return{
    push: push,
    getAll: getAll,
    remove: remove,
  };
})

.factory('FavoriteStops', function(){
  var stops = [];
  var push = function(stop){
    localforage.getItem('favoriteStops', function(err, value){
      var newArray = [];
      if(value !== null) {
        console.log("no  stops yet!");
        newArray = value;
        newArray.push(stop);
      }
      else{
        console.log("already stops");
        newArray.push(stop);
      }
      localforage.setItem('favoriteStops', newArray, function(err, value){
      })  
    })
  };
  
  var getAll = function(){
    var ret = [];
    localforage.getItem('favoriteStops', function(err, value){
      
    })
  };
  
  var remove = function(stopId){
    localforage.getItem('favoriteStops', function(err, stops){
      console.log(stopId);
      //console.log(JSON.stringify(stops));
      for(var i = 0; i < stops.length; i++){
        if(stops[i].StopId === stopId) {
          stops.splice(i, 1);
        }
        //console.log(JSON.stringify(stops));
      }
      console.log(JSON.stringify(stops));
      localforage.setItem('favoriteStops', stops, function(err, newStops){
        console.log(JSON.stringify(newStops));
      })
    })
    
  };
  
  return{
    push: push,
    getAll: getAll,
    remove: remove,
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

