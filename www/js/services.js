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

.factory('Messages', function ($resource) {
  return $resource('http://bustracker.pvta.com/infopoint/rest/publicmessages/getcurrentmessages');
})




.factory('StopList', function(){
  var stopsList = [];
  var pushToList = function(stop){
    stopsList.push(stop);
  };
  var pushEntireList = function(list){
    stopsList.concat(list);
    return stopsList;
  };

  var getEntireList = function(){
    if(stopsList !== undefined){
      return stopsList;
    }
    else return 0;
  }
  
  var isEmpty = function(){
    if(stopsList.length === 0) return true;
    else return false
  };
  
  return {
    pushEntireList: pushEntireList,
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

.factory('MyLocation', function($cordovaGeolocation){
  var userLocation;

  calculateLocation = function(){
    $cordovaGeolocation.getCurrentPosition().then(function(position){
      userLocation = position.coords;
    });
  }
  
  getDistanceFrom = function(lat2, lon2) {
    lat1 = userLocation.latitude;
    lon1 = userLocation.longitude;
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    return dist
  }
  return{
    userLocation: userLocation,
    calculateLocation: calculateLocation,
    getDistanceFrom: getDistanceFrom
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
