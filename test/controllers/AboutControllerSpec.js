describe('AboutController', function () {
  // This will be instantiated in beforeEach
  // and will be used throughout the tests.
  var scope;
  // Create the base module, from which
  // all things branch.
  beforeEach(module('pvta'));
  // Explicitly inject necessary Angular modules.
  beforeEach(inject(function ($rootScope, $controller) {
    // This comes for free in actual controllers,
    // but tests must explicitly branch from the root scope.
    scope = $rootScope.$new();
    // Again, we must grab the controller 'ourselves.'
    $controller('AboutController', {$scope: scope});
  }));

  it('Should have a $scope variable', function () {
    expect(scope).toBeDefined();
  });
  it('Displays the current version number', function () {
    expect(scope.vNum).toEqual('0.6.0');
  });
});
