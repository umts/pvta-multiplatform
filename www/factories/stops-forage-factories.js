angular.module('pvta.factories')

.factory('StopsForage', function (StopList, Recent, Stops, NearestStops, $q, $cordovaGeolocation) {
  function getStopList () {
    if (StopList.isEmpty()) {
      return localforage.getItem('stops').then(function (stops) {
        if ((stops !== null) && (stops.list.length > 0) && (Recent.recent(stops.time))) {
          var msg = 'Loaded stops from storage';
          console.log(msg);
          ga('send', 'event', 'StopsLoaded', 'StopsForageFactory.getStopList()', msg);
          return stops.list;
        }
        else {
          var msg = 'No stops stored or stoplist is old';
          console.log(msg);
          ga('send', 'event', 'StopsNotLoaded', 'StopsForageFactory.getStopList()', msg);
          /* Grab the current position.
           * If we get it, get the list of stops based on that.
           * Otherwise, just get a list of stops.  Avail's purview
           * regarding order.
           */
          return $cordovaGeolocation.getCurrentPosition({timeout: 5000, enableHighAccuracy: true}).then(function (position) {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            var msg = 'Location acquired in StopForage!'
            console.log(msg);
            ga('send', 'event', 'LocationSuccess', '$cordovaGeolocation.getCurrentPosition', msg);
            return NearestStops.query({latitude: lat, longitude: long}).$promise;
          },
          function (err) {
            // Tell Google Analytics that a user doesn't have location
            ga('send', 'event', 'LocationFailure', '$cordovaGeolocation.getCurrentPosition', 'location failed on Routes and Stops; error: ' + err.msg);
            // If location services fail us, just
            // get a list of stops; ordering no longer matters.
            console.log('error finding position: ' + JSON.stringify(err));
            return Stops.query().$promise;
          });
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
