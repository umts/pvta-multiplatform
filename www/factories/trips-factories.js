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

  /*
   * Gets Google Trip Directions for a given set of parameters.
   * @param params: object containing:
            required: params.origin.id and params.destination.id
            optional: params.datetime.time - Epoch datetime
                      params.datetime.type - String: 'departure' or 'arrival'
   *  ^^ see $scope.params in PlanTripController for an example
   * @param directionsDisplay: the object that will render the returned directions
   *          (is almost always an instance of google.maps.DirectionsRenderer)
   */
  function route(params, directionsDisplay, callback) {
    directionsService = new google.maps.DirectionsService;
    var route = {};
    transitOptions = {
      modes: [google.maps.TransitMode.BUS]
    };
    if (params.time.datetime !== undefined && params.time.type !== undefined && params.time.asap !== true) {
      if (params.time.type === 'departure') {
        transitOptions['departureTime'] = params.time.datetime;
      }
      else if (params.time.type === 'arrival') {
        transitOptions['arrivalTime'] = params.time.datetime;
      }
      else {
        console.error("Determining route for Plan Trip failed due to unexpected input. Expected 'arrival' or 'departure', received" + params.time.type);
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
        console.log(response);
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
    callback(steps);
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
