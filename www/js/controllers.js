angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('SearchCtrl', function($scope, $ionicFilterBar, $location, $interpolate, $state, $resource){
  var filterBarInstance;
  function getItems () {
    $scope.all = [];
    var routes = $resource('http://bustracker.pvta.com/infopoint/rest/routes/getallroutes').query({}, function(){
      for(var i = 0; i < routes.length; i++){
        $scope.all.push({name: routes[i].ShortName + ": " + routes[i].LongName,
                        type: 'route',
                        id: routes[i].RouteId
                        });
      }
    });
    var stops = $resource('http://bustracker.pvta.com/infopoint/rest/stops/getallstops').query({}, function(){
      for(var i = 0; i < stops.length; i++){
        $scope.all.push({name: stops[i].Name,
                        type: 'stopDeparture',
                        id: stops[i].StopId
                        });
      }
    });
    }
  getItems();
  $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.all,
        update: function (filteredItems, filterText) {
          $scope.all = filteredItems;
        }
      });
    };
  $scope.refreshItems = function () {
      if (filterBarInstance) {
        filterBarInstance();
        filterBarInstance = null;
      }

      $timeout(function () {
        getItems();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };
})

.controller('VehiclesCtrl', function($scope, $resource, Vehicle){
  $scope.vehicles = $resource('http://bustracker.pvta.com/infopoint/rest/vehicles/getallvehicles').query(function(){
    $scope.vehicles.sort(function(a, b){return a.Name - b.Name});
  });
})

.controller('VehicleCtrl', function($scope, $stateParams, Vehicle, LatLong, $location){
  $scope.vehicle = Vehicle.get({vehicleId: $stateParams.vehicleId});
  $scope.setCoordinates = function(lat, long){
    LatLong.push(lat, long);
    $location.path('/app/map')
  }
})

.controller('RouteController', function($scope, $resource){
  $scope.routes = $resource('http://bustracker.pvta.com/infopoint/rest/routes/getvisibleroutes').query(function(){
    $scope.routes.sort(function(a, b){return a.ShortName - b.ShortName})
  });
})

.controller('RouteCtrl', function($scope, $stateParams, Route, RouteVehicles){
  var size = 0
  var route = Route.get({routeId: $stateParams.routeId}, function() {
    route.$save();
    groups(route.Stops.length);
  });
  $scope.route = route;
  $scope.groups = [];
  $scope.vehicles = RouteVehicles.query({routeId: $stateParams.routeId});
  $scope.groups.push(route);
    $scope.groups[0] = {
    //  name: 'stops',
      items: []
    };
  var j = $scope.size
  var groups = function(length){
    for (var j=0; j < length; j++) {
      $scope.groups[0].items.push(route.Stops[j]);
    }
  };
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
})

.controller('StopDeparturesController', function($scope, $stateParams, $resource, $location, $interval, $rootScope, Stop, StopDeparture, moment, LatLong, getDepartureInfo){
  var originalGoBack = $rootScope.$ionicGoBack;
  $rootScope.$ionicGoBack = function() {
    $interval.cancel(timer);
    originalGoBack();
  };
  var timer=$interval(function(){
        getDepartures();
      },3000);
  var getDepartures = function(){
    var deps = StopDeparture.query({stopId: $stateParams.stopId}, function(){
      var directions = deps[0].RouteDirections;
      $scope.departures = [];
        console.log("refreshed!");
        for(var i = 0; i < directions.length; i++){
          if(directions[i].Departures.length !== 0 && !directions[i].IsDone){
            var departureNum = 0;
            var sdt = directions[i].Departures[departureNum].SDT;
            var edt = directions[i].Departures[departureNum].EDT;
            var times = {s: moment(sdt).fromNow(), e: moment(edt).fromNow()};
            while(times.e.includes('ago')){
              departureNum++;
              sdt = directions[i].Departures[departureNum].SDT;
              edt = directions[i].Departures[departureNum].EDT;
              times = {s: moment(sdt).fromNow(), e: moment(edt).fromNow()};
            }
            directions[i].StringifiedTimes = times;
            var r = {route: directions[i].RouteId, trip: directions[i].Departures[departureNum].Trip, departures: times};
            $scope.departures.push(r);
          }
        }
    });
  } // end getDepartures
  $scope.stop = Stop.get({stopId: $stateParams.stopId});
  $scope.$on('$destroy', function() {
    $interval.cancel(timer);
  });
  $scope.setCoordinates = function(lat, long){
    LatLong.push(lat, long);
    $interval.cancel(timer);
    $location.path('/app/map')
  }
})

.controller('MapCtrl', function($scope, $state, $resource, $stateParams, $cordovaGeolocation, Route, Vehicle, LatLong) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  var ll = LatLong.pop();
  $scope.lats = ll;

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(ll.lat, ll.long);
    var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var bounds = new google.maps.LatLngBounds();
    bounds.extend(latLng);
    bounds.extend(myLocation);

    var mapOptions = {
      center: bounds.getCenter(),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      $scope.map.fitBounds(bounds);
      var neededMarker = new google.maps.Marker({
        map: $scope.map,
        icon: 'http://www.google.com/mapfiles/kml/paddle/go.png',
        animation: google.maps.Animation.DROP,
        position: latLng
      });
      var myMarker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: myLocation,
        title: "You're here!"
        });
      google.maps.event.addListener(myMarker, 'click', function () {
          var infoWindow = new google.maps.InfoWindow({
            content: "You are here!"
          });
          infoWindow.open($scope.map, myMarker);
      });
      google.maps.event.addListener(neededMarker, 'click', function () {
          var infoWindow = new google.maps.InfoWindow({
            content: "Here's what you're looking for!"
          });
          infoWindow.open($scope.map, neededMarker);
      });
    });

    }, function(error){
      console.log("Could not get location");
    });
});
