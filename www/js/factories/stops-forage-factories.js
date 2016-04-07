angular.module('pvta.factories')

.factory('StopsForage', function(StopList, Recent, Stops, NearestStops, $q){
  function getStopList(lat, long){
    if(StopList.isEmpty()){
      return localforage.getItem('stops').then(function(stops){
        if((stops != null) && (stops.list.length > 0) && (Recent.recent(stops.time))){
          return stops.list;
        }
        else {
          if(lat && long) {
            return NearestStops.query({latitude: lat, longitude: long}).$promise;
          }
          else {
            return Stops.query().$promise;
          }
        }
      });
    }
    else return $q.when(StopList.getEntireList());
  };
  function saveStopList(list){
    if(StopList.isEmpty()) {
      StopList.pushEntireList(list);
    }
    pushListToForage(list);
  }
  function pushListToForage(stops){
    var toForage = {
      list: stops,
      time: moment()
    };
    localforage.setItem('stops', toForage, function(err, val){if (err)console.log("localforage stops saving error: "+err); else console.log('done')});
  }
  function uniq(stops) {
    return _.uniq(stops, false, function (stop) {
      return stop.StopId;
    });
  }
  return {
    get: getStopList,
    save: saveStopList,
    uniq: uniq
  };
})