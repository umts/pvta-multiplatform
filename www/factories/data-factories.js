angular.module('pvta.factories')

.factory('Avail', function () {
  return 'https://bustracker.pvta.com/infopoint/rest';
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

.factory('NearestStop', function ($resource, Avail) {
  return $resource(Avail + '/Stops/NearestStop?latitude=:latitude&longitude=:longitude', { latitude: '@latitude', longitude: '@longitude' });
})

.factory('NearestStops', function ($resource, Avail) {
  return $resource(Avail + '/Stops/Nearest?latitude=:latitude&longitude=:longitude', { latitude: '@latitude', longitude: '@longitude' });
})

.factory('Stop', function ($resource, Avail) {
  return $resource(Avail + '/stops/get/:stopId');
})

.factory('Stops', function ($resource, Avail) {
  return $resource(Avail + '/stops/getallstops');
})

.factory('RouteVehicles', function ($resource, Avail) {
  return $resource(Avail + '/vehicles/getallvehiclesforroute?routeid=:id');
})

.factory('StopDeparture', function ($resource, Avail) {
  return $resource(Avail + '/stopdepartures/get/:stopId');
})

.factory('Messages', function ($resource, Avail) {
  return $resource(Avail + '/publicmessages/getcurrentmessages');
})

.factory('SimpleRoute', function ($resource, Avail) {
  return $resource(Avail + '/routes/get/:routeId');
})
