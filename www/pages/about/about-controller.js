angular.module('pvta.controllers').controller('AboutController', function ($scope, $window, Info) {
  ga('set', 'page', '/about.html');
  ga('send', 'pageview');
  $scope.vNum = Info.versionNum;
  $scope.vName = Info.versionName;
  /*
    Opens a given URL in the browser.
  */
  $scope.openLink = function(url) {
    // If we're on a device, we have to use cordova
    // to open the default browser
    if ($window.cordova) {
      // We have to make sure that cordova is properly loaded before
      // using one of its plugins.
      document.addEventListener("deviceready", onDeviceReady, false);
      function onDeviceReady() {
        // Open the given URL in the system browser
        console.log('Opening ' + url + 'in the browser');
        cordova.InAppBrowser.open(url, '_system');
      }
    }
    // If we're running as a web-app in a standard browser,
    // we can just open the link in a new tab.
    else {
      $window.open(url);
    }
  }
});
