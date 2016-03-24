angular.module('pvta.controllers').controller('SettingsController', function ($scope) {

  $scope.message = '';

  $scope.autorefresh = 45000;
  localforage.getItem('autoRefresh', function (err, value) {
    if (value) $scope.autorefresh = value;
    else console.log(err);
  });

  $scope.updateRefresh = function (val) {
    console.log('updaterefresh called');
    localforage.setItem('autoRefresh', val, function (err, value) {
      console.log(err + value);
    });
  };

  $scope.clear = function () {
    localforage.clear(function (err) {
      $scope.message = 'Your favorites have been successfully deleted';
    });
  };
});