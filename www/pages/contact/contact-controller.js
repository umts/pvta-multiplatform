angular.module('pvta.controllers').controller('ContactController', function ($scope, $window) {
  ga('set', 'page', '/about/contact.html');
  ga('send', 'pageview');
  /*
    Opens a given URL in the browser.
  */
  $scope.openLink = function (url) {
    console.log('Opening ' + url + ' in the browser');
    // If we're on a device, we have to use cordova
    // to open the default browser
    if ($window.cordova) {
      // We have to make sure that cordova is properly loaded before
      // using one of its plugins.
      document.addEventListener('deviceready', function () {
        cordova.InAppBrowser.open(url, '_system');
      }, false);
    }
    // If we're running as a web-app in a standard browser,
    // we can just open the link in a new tab.
    else {
      $window.open(url);
    }
  };
});
