angular.module('pvta.directives', []).directive('vehicle', function () {
  return {
    scope: {
      vehicle: '=data',
      route: '=route',
    },
    templateUrl: 'directives/vehicle/vehicle-directive.html',
  };
});
