angular.module('pvta.controllers').controller('AboutController', function ($scope, $window, Info) {
  ga('set', 'page', '/about.html');
  ga('send', 'pageview');
  $scope.vNum = Info.versionNum;
  $scope.vName = Info.versionName;
  /*
    Uses the cordova InAppBrowser plugin to open a given
    URL in the device's default browser.
  */
  $scope.openLink = function(url) {
    if (window.cordova) {
      // We have to make sure that cordova is properly loaded before
      // using one of its plugins.
      document.addEventListener("deviceready", onDeviceReady, false);
      function onDeviceReady() {
        // Open the given URL in the system browser
        console.log('Opening ' + url + 'in the browser');
        cordova.InAppBrowser.open(url, '_system');
      }
    }
    else {
      $window.open(url);
    }
  }
});
