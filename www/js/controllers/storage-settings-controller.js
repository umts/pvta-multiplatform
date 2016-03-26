angular.module('pvta.controllers').controller('StorageSettingsController', function ($scope, $ionicPopup, $ionicLoading) {
  $scope.clearAll = function () {
    var confirmPopup = showConfirmPopup('Delete All Data?', 'Are you sure?  This removes all your favorites and cannot be undone.');
    confirmPopup.then(function (res) {
      if (res) {
        localforage.clear(function (err) {
          showAlertPopup('Your data has been deleted', 'Have fun adding it all back...muahahaha');
        });
      }
      else {
      }
    });
  };
  $scope.clearRoutes = function () {
    var confirmPopup = showConfirmPopup('Delete All Route Storage?', '<center>Are you sure? This removes all routes and could cost you data when redowloading.</center>');
    confirmPopup.then(function (res) {
      if (res) {
        localforage.removeItem('routes', function (success) {
          showAlertPopup('Routes Deleted', '<center>Bye bye!</center>');
        });
      }
    });
  };
  $scope.clearStops = function () {
    var confirmPopup = showConfirmPopup('Delete All Stop Storage?', '<center>Are you sure? This removes all stops and could cost you data when redowloading.</center>');
    confirmPopup.then(function (res) {
      if (res) {
        localforage.removeItem('stops', function (success) {
          showAlertPopup('Stops Deleted', '<center>Bye bye!</center>');
        });
      }
    });
  };


  $scope.clearFavoriteStops = function () {
    var confirmPopup = showConfirmPopup('Delete Favorite Stops?', '<center>Are you sure?</center>');
    confirmPopup.then(function (res) {
      if (res) {
        localforage.removeItem('favoriteStops', function (success) {
          showAlertPopup('Favorite Stops Deleted', '<center>Bye bye!</center>');
        });
      }
    });
  };

  $scope.clearFavoriteRoutes = function () {
    var confirmPopup = showConfirmPopup('Delete Favorite Routes?', '<center>Are you sure?</center>');
    confirmPopup.then(function (res) {
      if (res) {
        localforage.removeItem('favoriteRoutes', function (success) {
          showAlertPopup('Favorite Routes Deleted', '<center>Bye bye!</center>');
        });
      }
    });
  };

  function showConfirmPopup (header, body) {
    return $ionicPopup.confirm({
      title: header,
      template: body
    });
  }
  function showAlertPopup (header, body) {
    return $ionicPopup.alert({
      title: header,
      template: body
    });
  }
});