angular.module('pvta.directives').directive('vehicle', function () {
  return {
    scope: {
      vehicle: '=data',
      color: '=color'
    },
    templateUrl: 'directives/vehicle/vehicle-directive.html'
  };
});
