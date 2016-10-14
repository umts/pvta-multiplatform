angular.module('pvta.factories')

.factory('StopsForage', function (StopList, Recent, Stops, NearestStops, $q) {
  function getStopList (lat, long) {
    if (StopList.isEmpty()) {
      return localforage.getItem('stops').then(function (stops) {
        if ((stops !== null) && (stops.list.length > 0) && (Recent.recent(stops.time))) {
          console.log('Loaded stops from storage')
          return stops.list;
        }
        else {
          console.log('No stops stored or stoplist is old')
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
      console.log('Stop list already loaded')
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
        console.log('localforage stops saving error: ' + err);
      }
      else {
        console.log('done');
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
