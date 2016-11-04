angular.module('pvta.directives').directive('route', function (FavoriteRoutes) {


  return {
    scope: {
      favoriteRoutes: '=favs',
      route: '=bananas',
      toggle: '=toggle'
    },
    templateUrl: 'directives/route/route-directive.html'
  };
});
