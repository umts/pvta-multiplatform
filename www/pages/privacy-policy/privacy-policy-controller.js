angular.module('pvta.controllers').controller('PrivacyPolicyController', function ($scope) {
  ga('set', 'page', '/privacy-policy.html');
  ga('send', 'pageview');

  $scope.log = function(){
    console.log("page rendered");
  };
});
