angular.module('pvta.directives', []).directive('vehicle', function() {
  return {
    scope: {
      vehicle: '=data',
      route: '=route',
    },
    templateUrl: 'http://'+window.location.host+'/directives/vehicle/vehicle-directive.html',
  }
});
