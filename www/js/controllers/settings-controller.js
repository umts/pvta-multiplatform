angular.module('pvta.controllers').controller('SettingsController', function($scope){
  
  
  $scope.autorefresh = 45000;
  
  $scope.updateRefresh = function(val){
    console.log("updaterefresh called");
    localforage.setItem('autoRefresh', val, function(err, value){
      console.log(err + value);
    })
  }
  
});