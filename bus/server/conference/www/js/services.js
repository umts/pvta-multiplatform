angular.module('starter.services', ['ngResource'])

.factory('Session', function ($resource) {
    //return $resource('http://localhost:5000/sessions/:sessionId');
    return $resource('http://bustracker.pvta.com/infopoint/rest/vehicles/get/:sessionId');
})

.factory('Route', function ($resource) {
    //return $resource('http://localhost:5000/sessions/:sessionId');
    return $resource('http://bustracker.pvta.com/infopoint/rest/routedetails/get/:routeId');
})

.factory('StopDeparture', function ($resource, $http) {
    var x = $resource('http://bustracker.pvta.com/infopoint/rest/stopdepartures/get/:stopId');
  console.log(JSON.stringify(x));
    return x;
  
  /*var s = {StopId: 72};
  var f = function ()
  $http.get('http://bustracker.pvta.com/infopoint/rest/stopdepartures/get/:stopId').
  then(function successCallback(response){
    s = response.data;
  }, function errorCallback(response){
    console.log('uh oh');
  });
  return s;*/
});