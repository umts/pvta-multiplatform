// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter.controllers', ['starter.services']);

angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'angularMoment', 'jett.ionic.filter.bar'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicFilterBarConfigProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppController'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchController'
      }
    }
  })
    .state('app.vehicle', {
    url: "/vehicles/:vehicleId",
    views: {
        'menuContent': {
          templateUrl: "templates/vehicle.html",
          controller: 'VehicleController'
        }
    }
  })
  
  .state('app.routes',{
      url: "/routes",
      views: {
        'menuContent': {
           templateUrl: "templates/routes.html",
           controller: 'RoutesController'
        }
      }
    })

  .state('app.route', {
    url: "/routes/:routeId",
    views: {
        'menuContent': {
          templateUrl: "templates/route.html",
          controller: 'RouteController'
        }
    }
  })
  
  .state('app.stop', {
    url: "/stops/:stopId",
    views: {
        'menuContent': {
          templateUrl: "templates/stop.html",
          controller: 'StopController'
        }
    }
  })

  .state('app.stops', {
    url: "/stops",
    views: {
      'menuContent': {
        templateUrl: "templates/stops.html",
        controller: 'StopsController'
      }
    }
  })

  .state('app.map', {
    url: "/map",
    views: {
        'menuContent': {
          templateUrl: "templates/map.html",
          controller: 'MapController'
        }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/search');
});
