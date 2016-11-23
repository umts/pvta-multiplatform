angular.module('pvta.factories')

.factory('FavoriteRoutes', function () {
  var push = function (route) {
    localforage.getItem('favoriteRoutes', function (err, favoriteRoutes) {
      var newRoute = {
        RouteId: route.RouteId,
        GoogleDescription: route.GoogleDescription,
        ShortName: route.ShortName,
        RouteAbbreviation: route.RouteAbbreviation,
        Color: route.Color
      };

      if (favoriteRoutes) {
        favoriteRoutes.push(newRoute);
        localforage.setItem('favoriteRoutes', favoriteRoutes);
      }
      else {
        var newFavoriteRoute = [newRoute];
        localforage.setItem('favoriteRoutes', newFavoriteRoute);
      }
      ga('send', 'event', 'FavoriteRouteAdded', 'FavoriteRoutes.push()', 'Favorited route with ID: ' + route.RouteId);
    });
  };

  var getAll = function () {
    return localforage.getItem('favoriteRoutes');
  };

  var remove = function (favoriteRoute) {
    localforage.getItem('favoriteRoutes', function (err, favoriteRoutes) {
      for (var i = 0; i < favoriteRoutes.length; i++) {
        if (favoriteRoutes[i].RouteId === favoriteRoute.RouteId) {
          favoriteRoutes.splice(i, 1);
        }
      }
      localforage.setItem('favoriteRoutes', favoriteRoutes, function (err) {
        if (err) {
          console.log('Error getting all favorite stops: ' + err);
        }
      });
    });
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
