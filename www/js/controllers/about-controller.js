angular.module('pvta.controllers').controller('AboutController', function($scope, Info){
  $scope.vNum = Info.versionNum;
  $scope.vName = Info.versionName;
});