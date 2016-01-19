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

.service('getDepartureInfo', function(){
  
  //'STOLEN' FROM BUSINFOBOARD
  return function getDepartureInfo(directions) {
  // This is a little tricky. There's a sort of edge case where we want to
  // display information for multiple buses on the same route, that are doing
  // different things. We differentiate them by using their
  // InternetServiceDesc, which will be different. Since the departures are
  // ordered from soonest to furthest away, we care about the first one with
  // a unique InternetServiceDesc, and that's what we're checking here.
  var unique_ISDs = [];
  departures = [];
  var route_ids = [];
  for (var i = 0; i < directions.length; i++) {
    var direction = directions[i];
    var route = routes[direction.RouteId];
    for (var j = 0; j < direction.Departures.length; j++) {
      var departure = direction.Departures[j];
      //If the departure has a unique InternetServiceDesc,
      if ($.inArray(departure.Trip.InternetServiceDesc, unique_ISDs) == -1
          //and if it's in the allowed routes,
          && (options.routes.length == 0 || $.inArray(route.ShortName, options.routes) != -1)
          //and if it's not in the excluded trips
          && (options.excluded_trips.length == 0 || $.inArray(departure.Trip.InternetServiceDesc, options.excluded_trips) == -1)
          //and if it's in the future,
          && moment(departure.EDT).isAfter(Date.now())) {
        // then we push it to the list, and push its ISD to the unique ISDs list.
        unique_ISDs.push(departure.Trip.InternetServiceDesc);
        departures.push({Departure: departure, Route: route});
        route_ids.push(route.RouteId);
        // A global list of routes running on our stops
        all_route_ids.push(route.RouteId);
      }
    }
  }
  return departures.sort(sort_function);
}
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

