angular.module('pvta.factories')

.factory('Trips', function () {
  var trips = [];
  var loadedTrip = null;
  var lastPoppedIndex = 0;
  var steps = [];

  var getAll =  function (callback) {
    localforage.getItem('savedTrips', function (err, value) {
      if (err) {
        console.log('Error loading trips.;');
        callback([]);
        return;
      }
      if (value === null) {
        console.log('No trips loaded');
        callback([]);
        return;
      }
      trips = JSON.parse(value);
      for (var i = 0; i < trips.length; i = i + 1) {
        trips[i].time.datetime = new Date(trips[i].time.datetime);
      }
      callback(trips);
    });
  };

  var push = function (index) {
    lastPoppedIndex = index;
    loadedTrip = trips[index];
  };

  var pop = function () {
    var toReturn = loadedTrip;
    loadedTrip = null;
    return toReturn;
  };

  var set = function (trip) {//Sets a new trip object at the index of the last trip popped
    trips[lastPoppedIndex] = trip;
    localforage.setItem('savedTrips', JSON.stringify(trips), function (err) {
      if (err !== null) {
        console.log('Error saving trips.');
      }
    });
  };

  var add = function (trip) {
    trips.push(trip);
    localforage.setItem('savedTrips', JSON.stringify(trips), function (err) {
      if (err !== null) {
        console.log('Error saving trips.');
      }
    });
  };

  var remove = function (index) {
    trips.splice(index, 1);
    localforage.setItem('savedTrips', JSON.stringify(trips), function (err) {
      if (err !== null) {
        console.log('Error saving trips.');
      }
    });
  };
  
  function route(params, directionsDisplay, callback) {//params.origin.id and params.destination.id required
                          // directionDisplay is google.maps.DirectionsRenderer
                          //optional: params.datetime.time
                          //          params.datetime.type 'departure' or 'arrival'
    directionsService = new google.maps.DirectionsService;
    var route = {};
    transitOptions = {
      modes: [google.maps.TransitMode.BUS]
    };
    if (params.time.datetime !== undefined && params.time.type !== undefined && params.time.asap !== true) {
      if (params.time.type === 'departure') {
        transitOptions['departureTime'] = params.time.datetime;
      }
      else {
        transitOptions['arrivalTime'] = params.time.datetime;
      }
    }
    directionsService.route({
      origin: {'placeId': params.origin.id},
      destination: {'placeId': params.destination.id},
      travelMode: google.maps.TravelMode.TRANSIT,
      transitOptions: transitOptions
    }, function (response, status) {
      route.status = status;
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        leg = response.routes[0].legs[0];
        steps = leg.steps;
        if (leg['arrival_time']) {
          route.arrivalTime = leg['arrival_time']['text'];
        }
        if (leg['departure_time']) {
          route.departureTime = leg['departure_time']['text'];
        }
        route.origin = leg['start_address'];
        route.destination = leg['end_address'];
      } else console.log(status);
      callback(route);
    });

  }

  //Use as a callback method to retrieve a hash of directions and their respective
  //links (links go to a Stop page). To be called after a successful route()
  function generateDirections(callback) {
    directions = [];
    for (var i=0; i < steps.length; i++) {
      step = steps[i];
      if (step['travel_mode'] === 'TRANSIT') {
        var lineName;
        if (step['transit']['line']['short_name']) {
          lineName = step['transit']['line']['short_name'];
        }
        else {
          lineName = step['transit']['line']['name'];
        }
        var departInstruction = 'Take ' + step['transit']['line']['vehicle']['name'] + ' ' + lineName + ' at ' + step['transit']['departure_time']['text'] + '. ' + step['instructions'];
        var arriveInstruction = 'Arrive at ' + step['transit']['arrival_stop']['name'] + ' ' + step['transit']['arrival_time']['text'];
        directions.push(departInstruction);
        directions.push(arriveInstruction);
      }
      else {
        directions.push(step['instructions']);
      }
    }
    callback(directions);
  }

  return {
    getAll: getAll,
    push: push,
    pop: pop,
    set: set,
    add: add,
    remove: remove,
    route: route,
    generateDirections
  };
});
