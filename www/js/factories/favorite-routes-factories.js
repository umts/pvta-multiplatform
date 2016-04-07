angular.module('pvta.factories')

.factory('FavoriteRoutes', function () {
  var routes = [];
  var push = function (route) {
    localforage.getItem('favoriteRoutes', function (err, routes) {
      var newRoute = { RouteId: route.RouteId,
                       LongName: route.LongName,
                       ShortName: route.ShortName,
                       Color: route.Color
      };

      if (routes) {
        routes.push(newRoute);
        localforage.setItem('favoriteRoutes', routes);
      }
      else {
        var favoriteRoutes = [newRoute];
        localforage.setItem('favoriteRoutes', favoriteRoutes);
      }

    });
  };

  var getAll = function () {
    return localforage.getItem('favoriteRoutes');
  };

  var remove = function (route) {
    localforage.getItem('favoriteRoutes', function (err, routes) {
      for (var i = 0; i < routes.length; i++) {
        if (routes[i].RouteId === route.RouteId) {
          routes.splice(i, 1);
        }
      }
      localforage.setItem('favoriteRoutes', routes, function (err) {
        if (err) {
          console.log('Error getting all favorite stops: ' + err);
        }
      });
    });
    removeOneRoute(route);
  };

  /* Checks to see if a route is included
   * in the favorites. Returns boolean.
   */
  function contains (route, cb) {
    localforage.getItem('favoriteRoutes', function (err, routes) {
      if (routes) {
        var r = _.where(routes, {RouteId: route.RouteId});
        if (r.length > 0) {
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
