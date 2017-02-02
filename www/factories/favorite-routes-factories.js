angular.module('pvta.factories')

.factory('FavoriteRoutes', function (Toast) {
  var push = function (route) {
    localforage.getItem('favoriteRoutes').then(function (favoriteRoutes) {
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
      Toast.show('Added the ' + route.RouteAbbreviation + ' to your favorites!', 3000);
    }).catch(function () {
      Toast.show('Couldn\'t favorite route.', 2000);
    });
  };

  var getAll = function () {
    return localforage.getItem('favoriteRoutes');
  };
  // Removes a route from the user's Favorites.
  // @param favoriteRoute - a Route object.
  var remove = function (favoriteRoute) {
    // First, load the existing list of favorite routes.
    localforage.getItem('favoriteRoutes').then(function (favoriteRoutes) {
      // Go through the list until we find the one we're trying to remove.
      for (var i = 0; i < favoriteRoutes.length; i++) {
        if (favoriteRoutes[i].RouteId === favoriteRoute.RouteId) {
          favoriteRoutes.splice(i, 1);
        }
      }
      // Save the new list, which has the desired route removed.
      localforage.setItem('favoriteRoutes', favoriteRoutes, function (err) {
        if (err) {
          console.log('Error saving removed favorite route: ' + err);
        }
      });
      Toast.show('Removed the ' + favoriteRoute.RouteAbbreviation + ' from your favorites!', 3000);
    // In the event that we can't load favorites, show an error.
    }).catch(function () {
      Toast.show('Couldn\'t unfavorite route.');
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
