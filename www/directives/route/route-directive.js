angular.module('pvta.directives').directive('route', function () {

  return {
    scope: {
      liked: '=likedRoute',
      route: '=bananas',
      toggleRoute: '=toggleRoute'
    },
    templateUrl: 'directives/route/route-directive.html'
  };
});
