angular.module('pvta.factories')
.factory('FavoriteStops', function () {
  var stops = [];
  var push = function (stop) {
    localforage.getItem('favoriteStops', function (err, stops) {
      var newStop = {StopId: stop.StopId, Description: stop.Description};
      if (stops) {
        stops.push(newStop);
        localforage.setItem('favoriteStops', stops);
      }
      else {
        var favoriteStops = [newStop];
        localforage.setItem('favoriteStops', favoriteStops);
      }
    });
  };

  var getAll = function () {
    localforage.getItem('favoriteStops', function (err) {
      if (err) {
        console.log('Error getting all favorite stops: ' + err);
      }
    });
  };

  var remove = function (stop) {
    localforage.getItem('favoriteStops', function (err, stops) {
      for (var i = 0; i < stops.length; i++) {
        if (stops[i].StopId === stop.StopId) {
          stops.splice(i, 1);
        }
      }
      localforage.setItem('favoriteStops', stops, function (err) {
        if (err) {
          console.log('Error removing favorite stop: ' + err);
        }
      });
    });
  };

  function contains (stopId, cb) {
    localforage.getItem('favoriteStops', function (err, stops) {
      if (stops) {
        var filteredStops = _.where(stops, { StopId: stopId });
        if (filteredStops.length > 0) {
          cb(true);
        }
        else {
          cb(false);
        }
      }
      else {
        cb(false);
      }
    });
  }
  return {
    push: push,
    getAll: getAll,
    remove: remove,
    contains: contains
  };
});
