angular.module('pvta.factories')

.factory('Trips', function () {
  var trips = [];
  var loadedTrip = null;
  var lastPoppedIndex = 0;

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

  return {
    getAll: getAll,
    push: push,
    pop: pop,
    set: set,
    add: add,
    remove: remove,
  };
});
