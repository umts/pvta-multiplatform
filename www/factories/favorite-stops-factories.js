angular.module('pvta.factories')
.factory('FavoriteStops', function () {

  var push = function (stop) {
    localforage.getItem('favoriteStops', function (err, savedFavoriteStops) {
      var newStop = {StopId: stop.StopId, Name: stop.Name};
      if (savedFavoriteStops) {
        savedFavoriteStops.push(newStop);
        localforage.setItem('favoriteStops', savedFavoriteStops);
      }
      else {
        var favoriteStops = [newStop];
        localforage.setItem('favoriteStops', favoriteStops);
      }
      ga('send', 'event', 'FavoriteStopAdded', 'FavoriteStops.push()', 'Favorited stop with ID: ' + stop.StopId);
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
        var favStopIDs = _.pluck(stops, 'StopId');
        var idIsInArray = _.contains(favStopIDs, parseInt(stopId));
        cb(idIsInArray);
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
