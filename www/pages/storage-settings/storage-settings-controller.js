angular.module('pvta.controllers').controller('StorageSettingsController', function ($scope, $ionicPopup) {
  ga('set', 'page', '/storage-settings.html');
  ga('send', 'pageview');
  $scope.clearAll = function () {
    var confirmPopup = showConfirmPopup('Delete All Data?', 'Are you sure?  This removes all your favorites and cannot be undone.');
    confirmPopup.then(function (res) {
      if (res) {
        localforage.clear(function () {
          showAlertPopup('All Data Deleted', 'Favorites and cached PVTA data have been deleted.');
        });
      }
    });
  };
  $scope.clearRoutes = function () {
    var confirmPopup = showConfirmPopup('Delete All Route Storage?', '<center>Are you sure? This removes all routes and could cost you data when redowloading.</center>');
    confirmPopup.then(function (res) {
      if (res) {
        localforage.removeItem('routes', function () {
          showAlertPopup('Routes Deleted');
        });
      }
    });
  };
  $scope.clearStops = function () {
    var confirmPopup = showConfirmPopup('Delete All Stop Storage?', '<center>Are you sure? This removes all stops and could cost you data when redowloading.</center>');
    confirmPopup.then(function (res) {
      if (res) {
        localforage.removeItem('stops', function () {
          showAlertPopup('Stops Deleted');
        });
      }
    });
  };


  $scope.clearFavoriteStops = function () {
    var confirmPopup = showConfirmPopup('Delete Favorite Stops?', '<center>Are you sure?</center>');
    confirmPopup.then(function (res) {
      if (res) {
        localforage.removeItem('favoriteStops', function () {
          showAlertPopup('Favorite Stops Deleted');
        });
      }
    });
  };

  $scope.clearFavoriteRoutes = function () {
    var confirmPopup = showConfirmPopup('Delete Favorite Routes?', '<center>Are you sure?</center>');
    confirmPopup.then(function (res) {
      if (res) {
        localforage.removeItem('favoriteRoutes', function () {
          showAlertPopup('Favorite Routes Deleted');
        });
      }
    });
  };

  function showConfirmPopup (header, body) {
    return $ionicPopup.confirm({
      title: header,
      template: body,
      okText: 'Yes'
    });
  }
  function showAlertPopup (header, body) {
    return $ionicPopup.alert({
      title: header,
      template: body
    });
  }
});
