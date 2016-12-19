// pvta-multiplatform

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'pvta' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'pvta.controllers' is found in controllers.js
angular.module('pvta.controllers', ['pvta.factories', 'pvta.directives']);
angular.module('pvta.factories', ['ngResource']);
angular.module('pvta.directives', []);
angular.module('pvta', ['ionic', 'ngCordova', 'pvta.controllers', 'angularMoment', 'jett.ionic.filter.bar', 'underscore', 'ionic-datepicker', 'ionic-timepicker', 'ngAnimate', 'ngAria'])

.constant('ionicLoadingConfig', {
  hideOnStateChange: true,
  duration: 5000
})

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
  });
  /******************************************************
   * Set the status bar color to our app's color.
   *********************************************************
   * Only after the device has specifically told us it's ready
   * may we access the global StatusBar object.
   * **************************************************/
  document.addEventListener('deviceready', onDeviceReady, true);
  function onDeviceReady () {
    if (ionic.Platform.isAndroid()) {
      StatusBar.backgroundColorByHexString('#2758ab');
    }
    else {
      StatusBar.backgroundColorByHexString('#387ef5');
    }
  }
})

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  // Successively define every state by chaining
  // .state() functions on top of each other
  .state('app', {
    url: '/app',
    abstract: true,
    cache: false,
    templateUrl: 'pages/app/menu.html'
  })
  .state('app.my-buses', {
    url: '/my-buses',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'pages/my-buses/mybuses.html',
        controller: 'MyBusesController'
      }
    }
  })
  .state('app.routes-and-stops', {
    url: '/routes-and-stops/:segment',
    views: {
      'menuContent': {
        templateUrl: 'pages/routes-and-stops/routes-and-stops.html',
        controller: 'RoutesAndStopsController'
      }
    }
  })
  .state('app.route', {
    url: '/routes/:routeId',
    views: {
      'menuContent': {
        templateUrl: 'pages/route/route.html',
        controller: 'RouteController'
      }
    }
  })
  .state('app.stop', {
    url: '/stops/:stopId',
    views: {
      'menuContent': {
        templateUrl: 'pages/stop/stop.html',
        controller: 'StopController'
      }
    }
  })
  .state('app.storage-settings', {
    url: '/settings/storage',
    views: {
      menuContent: {
        templateUrl: 'pages/storage-settings/storage-settings.html',
        controller: 'StorageSettingsController'
      }
    }
  })
  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'pages/settings/settings.html',
        controller: 'SettingsController'
      }
    }
  })
  .state('app.plan-trip', {
    url: '/plan-trip',
    views: {
      'menuContent': {
        templateUrl: 'pages/plan-trip/plan-trip.html',
        controller: 'PlanTripController'
      }
    }
  })
   .state('app.about', {
     url: '/about',
     views: {
       'menuContent': {
         templateUrl: 'pages/about/about.html',
         controller: 'AboutController'
       }
     }
   })
  .state('app.route-map', {
    url: '/map/route/:routeId',
    views: {
      'menuContent': {
        templateUrl: 'pages/route-map/map.html',
        controller: 'RouteMapController'
      }
    }
  })
  .state('app.stop-map', {
    url: '/map/stop/:stopId',
    views: {
      'menuContent': {
        templateUrl: 'pages/stop-map/stop-map.html',
        controller: 'StopMapController'
      }
    }
  })
  .state('app.privacy-policy', {
    url: '/about/privacy-policy',
    views: {
      'menuContent': {
        templateUrl: 'pages/privacy-policy/privacy-policy.html',
        controller: 'PrivacyPolicyController'
      }
    }
  })
  .state('app.contact', {
    url: '/about/contact',
    views: {
      'menuContent': {
        templateUrl: 'pages/contact/contact.html',
        controller: 'ContactController'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/my-buses');
});
