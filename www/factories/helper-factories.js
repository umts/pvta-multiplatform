angular.module('pvta.factories')

.factory('Helper', function ($state) {

  function redirectToStop (stopId) {
    $state.go('app.stop', {stopId: stopId});
  }

  function redirectToRoute (routeId) {
    $state.go('app.route', {routeId: routeId});
  }

  return {
    redirectToStop: redirectToStop,
    redirectToRoute: redirectToRoute
  };
});
