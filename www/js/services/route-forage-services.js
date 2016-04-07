angular.module('pvta.services')

.factory('RouteForage', function(RouteList, moment, Recent, Routes, $q){
  function getRouteList(){
    if(RouteList.isEmpty()){
      return localforage.getItem('routes').then(function(routes){
        if((routes != null) && (routes.list.length > 0) && (Recent.recent(routes.time))){
          return routes.list;
        }
        else {
          return Routes.query().$promise;
        }
      });
    }
    else return $q.when(RouteList.getEntireList());
  };
  function saveRouteList(list){
    if(RouteList.isEmpty()) {
      RouteList.pushEntireList(list);
    }
    pushListToForage(list);
  }
  function pushListToForage(routes){
    var toForage = {
      list: routes,
      time: moment()
    }
    localforage.setItem('routes', toForage, function(err, val){if (err) console.log("localforage routes saving error: "+err)});
  }
  return {
    get: getRouteList,
      save: saveRouteList
  };
})