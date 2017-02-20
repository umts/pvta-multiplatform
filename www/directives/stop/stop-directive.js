angular.module('pvta.directives').directive('stop', function () {

  return {
    scope: {
      stop: '=data',
    },
    templateUrl: 'directives/stop/stop-directive.html'
  };
});
