angular.module('pvta.directives').directive('stop', function () {

  return {
    scope: {
      liked: '=liked',
      stop: '=cucumber',
      toggle: '=toggle'
    },
    templateUrl: 'directives/stop/stop-directive.html'
  };
});
