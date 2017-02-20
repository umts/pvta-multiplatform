angular.module('pvta.directives').directive('route', function () {

  return {
    scope: {
      route: '=data',
    },
    templateUrl: 'directives/route/route-directive.html'
  };
});
