angular.module('pvta.controllers').controller('SettingsController', function($scope){
  
  
  $scope.autorefresh = 45000;
  localforage.getItem('autoRefresh', function(err, value){
    if (value) $scope.autorefresh = value;
    else console.log(err);
  });
  
  $scope.updateRefresh = function(val){
    console.log("updaterefresh called");
    localforage.setItem('autoRefresh', val, function(err, value){
      console.log(err + value);
    })
  }
});