angular.module('pvta.factories')

.factory('Helper', function ($state) {

  function redirectToStop (stopId) {
    $state.go('app.stop', {stopId: stopId});
  }

  function redirectToRoute (routeId) {
    $state.go('app.route', {routeId: routeId});
  }

  return {
    redirectToStop: redirectToStop,
    redirectToRoute: redirectToRoute
  };
});

angular.module('pvta.factories')

.factory('Toast', function ($cordovaToast, $ionicLoading, $interval) {
  // Shows a toast.
  // @param: duration - int. Can be 900, 2000, 3000, or 4000 due to a restriction in the
  // Cordova plugin.  Values are in milliseconds.
  function show (msg, duration) {
    if ((duration !== 900) && (duration !== 2000) && (duration !== 3000) && (duration !== 4000)) {
      console.error('Toast.show() received an invalid parameter of ' + duration);
      duration = 3000;
    }
    if (!ionic.Platform.is('browser')) {
      $cordovaToast.show(msg, duration, 'bottom');
    }
    else {
      $ionicLoading.hide();
      $interval(function () {
        $ionicLoading.show({
          template: msg,
          noBackdrop: true,
          duration: duration
        });
      }, 500, 1);
    }
  }
  function showStorageError () {
    Toast.show('Can\'t access device storage. Ensure you\'re not in private browsing and that you allow us to store data.', 4000);
  }

  return {
    show: show,
    showStorageError: showStorageError
  };
});
