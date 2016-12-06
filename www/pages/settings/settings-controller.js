angular.module('pvta.controllers').controller('SettingsController', function ($scope) {
  ga('set', 'page', '/settings.html');
  ga('send', 'pageview');

  $scope.autorefresh = 45000;
  localforage.getItem('autoRefresh', function (err, value) {
    if (value) $scope.autorefresh = value;
    else console.log(err);
  });

  $scope.updateRefresh = function (val) {
    localforage.setItem('autoRefresh', val, function (err, value) {
    });
  };
});
