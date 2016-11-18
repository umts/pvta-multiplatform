angular.module('pvta.directives').directive('route', function () {

  return {
    scope: {
      liked: '=liked',
      route: '=bananas',
      toggle: '=toggle'
    },
    templateUrl: 'directives/route/route-directive.html'
  };
});
