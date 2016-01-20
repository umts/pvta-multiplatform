angular.module('starter.services', ['ngResource'])

.factory('Vehicle', function ($resource) {
    return $resource('http://bustracker.pvta.com/infopoint/rest/vehicles/get/:vehicleId');
})

.factory('Route', function ($resource) {
    return $resource('http://bustracker.pvta.com/infopoint/rest/routedetails/get/:routeId');
})

.factory('Stop', function ($resource) {
    return $resource('http://bustracker.pvta.com/infopoint/rest/stops/get/:stopId');
})

.factory('RouteVehicles', function($resource){
    return $resource('http://bustracker.pvta.com/infopoint/rest/vehicles/getallvehiclesforroute?routeId=:routeId')
})

.factory('StopDeparture', function ($resource) {
    return $resource('http://bustracker.pvta.com/infopoint/rest/stopdepartures/get/:stopId');
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

