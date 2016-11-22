angular.module('pvta.factories')
.factory('FavoriteStops', function () {

  var push = function (stop) {
    localforage.getItem('favoriteStops', function (err, stops) {
      var newStop = {
        StopId: stop.StopId,
        Description: stop.Description
      };
      if (stops) {
        stops.push(newStop);
        localforage.setItem('favoriteStops', stops);
      }
      else {
        var favoriteStops = [newStop];
        localforage.setItem('favoriteStops', favoriteStops);
      }
      ga('send', 'event', 'FavoriteStopAdded', 'FavoriteStops.push()', 'Favorited stop with ID: ' + stop.StopId);
    });
  };

  var getAll = function () {
    return localforage.getItem('favoriteStops');
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
        var favStopIDs = _.pluck(stops, 'StopId');
        var idIsInArray = _.contains(favStopIDs, parseInt(stopId));
        cb(idIsInArray);
      }
      else {
        cb(false);
      }
    });
  }

  function toggleFavoriteStop (stop) {
    contains(stop.StopId, function (bool) {
      if (bool) {
        remove(stop);
      }
      else {
        push(stop);
      }
    });
  }
  return {
    push: push,
    getAll: getAll,
    remove: remove,
    contains: contains,
    toggleFavoriteStop: toggleFavoriteStop
  };
});
