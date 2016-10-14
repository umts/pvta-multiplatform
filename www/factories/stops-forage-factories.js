angular.module('pvta.factories')

.factory('StopsForage', function (StopList, Recent, Stops, NearestStops, $q) {
  function getStopList (lat, long) {
    if (StopList.isEmpty()) {
      return localforage.getItem('stops').then(function (stops) {
        if ((stops !== null) && (stops.list.length > 0) && (Recent.recent(stops.time))) {
          var msg = 'Loaded stops from storage';
          console.log('msg');
          ga('send', 'event', 'StopsLoaded', 'StopsForageFactory.getStopList()', msg);
          return stops.list;
        }
        else {
          var msg = 'No stops stored or stoplist is old';
          console.log(msg);
          ga('send', 'event', 'StopsNotLoaded', 'StopsForageFactory.getStopList()', msg);
          if (lat && long) {
            return NearestStops.query({latitude: lat, longitude: long}).$promise;
          }
          else {
            return Stops.query().$promise;
          }
        }
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
        var msg = 'Unable to save stops; Localforage error: ' + err;
        console.error(msg);
        ga('send', 'event', 'UnableToSaveStops', 'StopsForageFactory.pushListToForage()', msg);
      }
      else {
        var msg = 'Saved stops list.';
        console.log(msg);
        ga('send', 'event', 'SuccessfullySavedStops', 'StopsForageFactory.pushListToForage()', msg);
      }
    });
  }

  function uniq (stops) {
    return _.uniq(stops, false, function (stop) {
      return stop.StopId;
    });
  }

  return {
    get: getStopList,
    save: saveStopList,
    uniq: uniq
  };

});
