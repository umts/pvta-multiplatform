angular.module('pvta.factories')

.factory('StopsForage', function (StopList, Recent, Stops, NearestStops, $q, Toast) {
  function getStopList () {
    if (StopList.isEmpty()) {
      return localforage.getItem('stops').then(function (stops) {
        if ((stops !== null) && (stops.list.length > 0) && (Recent.recent(stops.time))) {
          var loadedMsg = 'Loaded stops from storage';
          console.log(loadedMsg);
          ga('send', 'event', 'StopsLoaded', 'StopsForageFactory.getStopList()', loadedMsg);
          return stops.list;
        }
        else {
          var notLoadedMsg = 'No stops stored or stoplist is old';
          console.log(notLoadedMsg);
          ga('send', 'event', 'StopsNotLoaded', 'StopsForageFactory.getStopList()', notLoadedMsg);
          /* Grab the current position.
           * If we get it, get the list of stops based on that.
           * Otherwise, just get a list of stops.  Avail's purview
           * regarding order.
           */
          return Stops.query().$promise;
        }
      }).catch(function () {
        Toast.showStorageError();
        return Stops.query().$promise;
      });
    }
    else {
      var msg = 'Stop list already loaded';
      console.log(msg);
      ga('send', 'event', 'StopsAlreadyLoaded', 'StopsForageFactory.getStopList()', msg);
      return $q.when(StopList.getEntireList());
    }
  }

  function saveStopList (list) {
    if (StopList.isEmpty()) {
      StopList.pushEntireList(list);
    }
    pushListToForage(list);
  }

  function pushListToForage (stops) {
    var toForage = {
      list: stops,
      time: new Date()
    };
    localforage.setItem('stops', toForage, function (err) {
      if (err) {
        var errorMsg = 'Unable to save stops; Localforage error: ' + err;
        console.error(errorMsg);
        Toast.showStorageError();
        ga('send', 'event', 'UnableToSaveStops', 'StopsForageFactory.pushListToForage()', errorMsg);
      }
      else {
        var successMsg = 'Saved stops list.';
        console.log(successMsg);
        ga('send', 'event', 'SuccessfullySavedStops', 'StopsForageFactory.pushListToForage()', successMsg);
      }
    });
  }

  function uniq (stops) {
    return _.uniq(stops, false, function (stop) {
      return stop.StopId;
    });
  }

  function getAllStopsWithFavorites () {
    return localforage.getItem('favoriteStops', function (err, favoriteStops) {
      getStopList().then(function (stops) {
        return _.map(stops, function (stop) {
          stop.Liked = _.contains(_.pluck(favoriteStops, 'StopId'), stop.StopId);
          return _.pick(stop, 'StopId', 'Name', 'Liked', 'Description');
        });
      });
    });
  }

  return {
    get: getStopList,
    save: saveStopList,
    uniq: uniq
  };

});
