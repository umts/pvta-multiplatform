angular.module('pvta.controllers').controller('StorageSettingsController', function ($scope, $ionicPopup, $ionicLoading){
  
  localforage.keys(function(err, keys) {
    // An array of all the key names.
    console.log(keys);
});
  
  $scope.clearAll = function () {
    var confirmPopup = showConfirmPopup('Delete All Data?', 'Are you sure?  This removes all your favorites and cannot be undone.');
    confirmPopup.then(function(res) {
      if(res) {
        localforage.clear(function (err) {
          showAlertPopup('Your data has been deleted', 'Have fun adding it all back...muahahaha');
        });
      } 
      else {
        console.log('Youve escaped this time, localforage!');
      }
    });
  };
  
  
  $scope.clearRoutes = function() {
    var confirmPopup = showConfirmPopup('Delete All Route Storage?', "<center>Are you sure? This removes all routes and could cost you data when redowloading.</center>");
    confirmPopup.then(function(res){
      if (res) {
        localforage.removeItem("routes", function(success) {
          showAlertPopup('Routes Deleted', '<center>Bye bye!</center>')
        });
      }
    })
  }
  
  
  $scope.clearStops = function() {
    var confirmPopup = showConfirmPopup('Delete All Stop Storage?', "<center>Are you sure? This removes all stops and could cost you data when redowloading.</center>");
    confirmPopup.then(function(res){
      if (res) {
        localforage.removeItem("stops", function(success) {
          showAlertPopup('Stops Deleted', '<center>Bye bye!</center>')
        });
      }
    })
  }
  
  
  
  
  
  function showConfirmPopup(header, body) {
    return confirmPopup = $ionicPopup.confirm({
       title: header,
       template: body
     });
  }
  function showAlertPopup(header, body) {
    return $ionicPopup.alert({
             title: header,
             template: body
           });
  }
})