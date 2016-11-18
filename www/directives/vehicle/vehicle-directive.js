angular.module('pvta.directives').directive('vehicle', function () {
  return {
    scope: {
      vehicle: '=data',
      route: '=apples'
    },
    templateUrl: 'directives/vehicle/vehicle-directive.html'
  };
});
