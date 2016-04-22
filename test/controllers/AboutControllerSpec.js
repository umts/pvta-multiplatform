describe("AboutController", function () {
  var $scope, ctrl, poo;
  beforeEach(module('pvta.controllers'));
  beforeEach(module('pvta.factories'));

  beforeEach(module('pvta'));

  beforeEach(inject(function ($rootScope, $controller) {
    $scope = $rootScope.$new();
    ctrl = $controller('AboutController', {$scope: $scope});
  }));

  it("Should have a $scope variable", function() {
    expect($scope).toBeDefined();
  });
  it("Displays the current version number", function() {
    expect($scope.vNum).toEqual('0.6.0');
  });
})
