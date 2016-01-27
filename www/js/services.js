angular.module('starter.services', ['ngResource'])

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
    if(stopsList !== undefined) return stopsList;
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
  var routesList = {};
  var pushToList = function(route){
    var id = route.RouteId
    routesList[id] = route;
  };
  var pushEntireList = function(list){
    for(var i = 0; i < list.length; i++){
      var id = list[i].RouteId;
      routesList[id] = list[i];
    }
    return routesList;
  };

  var getRouteFromList = function(id){
    if(routesList[id] !== undefined) return routesList[id];
    else return 0;
  };
  
  var getEntireList = function(){
    if(!isEmpty()) return routesList;
    else return 0;
  }
  
  var isEmpty = function(){
    if(Object.keys(routesList).length === 0) return true;
    else return false
  };
  
  return {
    pushEntireList: pushEntireList,
    getRouteFromList: getRouteFromList,
    getEntireList: getEntireList,
    pushToList: pushToList,
    isEmpty: isEmpty,  
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

