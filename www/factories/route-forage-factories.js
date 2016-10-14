angular.module('pvta.factories')

.factory('RouteForage', function (RouteList, moment, Recent, Routes, $q) {
  function getRouteList () {
    if (RouteList.isEmpty()) {
      return localforage.getItem('routes').then(function (routes) {
        if ((routes !== null) && (routes.list.length > 0) && (Recent.recent(routes.time))) {
          console.log('Loaded routes from storage.')
          return routes.list;
        }
        else {
          console.log('No routes stored or routelist is old')
          return Routes.query().$promise;
        }
      });
    }
    else {
      console.log('Route list already loaded')
      return $q.when(RouteList.getEntireList());
    }
  }

  function saveRouteList (list) {
    if (RouteList.isEmpty()) {
      RouteList.pushEntireList(list);
    }
    pushListToForage(list);
  }

  function pushListToForage (routes) {
    var toForage = {
      list: routes,
      time: new Date()
    };
    localforage.setItem('routes', toForage, function (err) {
      if (err) {
        console.log('localforage routes saving error: ' + err);
      }
    });
  }

  return {
    get: getRouteList,
    save: saveRouteList
  };
});
