angular.module('pvta.controllers').controller('StorageSettingsController', function ($scope, $ionicPopup){
  $scope.clear = function () {
    var confirmPopup = $ionicPopup.confirm({
       title: 'Delete All Data?',
       template: 'Are you sure?  This removes all your favorites and cannot be undone.'
     });
    confirmPopup.then(function(res) {
      if(res) {
        localforage.clear(function (err) {
          $scope.message = 'Your favorites have been successfully deleted';
          var alertPopup = $ionicPopup.alert({
             title: 'Your data has been deleted',
             template: 'Have fun adding it all back...muahahaha'
           });
          alertPopup.then(function(res) {
          });
        });
      } 
      else {
        console.log('Youve escaped this time, localforage!');
      }
    });
  };  
})