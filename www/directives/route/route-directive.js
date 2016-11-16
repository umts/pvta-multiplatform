angular.module('pvta.directives').directive('route', function (FavoriteRoutes) {


  return {
    scope: {
      liked: '=liked',
      route: '=bananas',
      toggle: '=toggle',
      _: '=underscore'
    },
    templateUrl: 'directives/route/route-directive.html'
  };
});
