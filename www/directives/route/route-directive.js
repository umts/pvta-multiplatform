angular.module('pvta.directives').directive('route', function () {

  return {
    scope: {
      liked: '=liked',
      route: '=data',
      toggle: '=toggle'
    },
    templateUrl: 'directives/route/route-directive.html'
  };
});
