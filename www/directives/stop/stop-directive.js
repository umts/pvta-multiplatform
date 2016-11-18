angular.module('pvta.directives').directive('stop', function () {

  return {
    scope: {
      liked: '=likedStop',
      stop: '=cucumber',
      toggleStop: '=toggleStop'
    },
    templateUrl: 'directives/stop/stop-directive.html'
  };
});
