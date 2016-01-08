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
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('VehiclesCtrl', function($scope, $http, Vehicle){
  //$scope.sessions = Session.query();
  $scope.vehicles = {};
  console.log('help!');
  $http.get('http://bustracker.pvta.com/infopoint/rest/vehicles/getallvehicles').
  then(function successCallback(response){
    $scope.vehicles = response.data.sort(function(a, b){return a.Name - b.Name});
  }, function errorCallback(response){
    console.log('An error! D:');
    console.log(response);
  });
})

.controller('VehicleCtrl', function($scope, $stateParams, Vehicle){
  $scope.vehicle = Vehicle.get({vehicleId: $stateParams.vehicleId});
})

.controller('RouteController', function($scope, $http){
  $scope.routes = [{Name: "B43"},{Name: "R14"}];
  $http.get('http://bustracker.pvta.com/infopoint/rest/routes/getallroutes').
  then(function successCallback(response){
    $scope.routes = response.data.sort(function(a, b){return a.ShortName - b.ShortName});;
  }, function errorCallback(response){
    console.log('uh oh');
  });
})

.controller('RouteCtrl', function($scope, $stateParams, Route){
  var route = Route.get({routeId: $stateParams.routeId});
  $scope.route = route;
})

.controller('StopDeparturesController', function($scope, $stateParams, $resource, $location, Stop, moment, LatLong){
  $scope.s = {};
  var s = $resource('http://bustracker.pvta.com/infopoint/rest/stopdepartures/get/:stopId');
  var x = s.query({stopId: $stateParams.stopId});
  $scope.s = x;
  $scope.init = function(sdt, edt){
    $scope.sdtString = moment(sdt).fromNow();
    $scope.edtString = moment(edt).fromNow();
    return {sdt: moment(sdt).fromNow(), edt: moment(edt).fromNow()}
  };
  var stop = Stop.get({stopId: $stateParams.stopId});
  $scope.q = stop;
  $scope.setCoordinates = function(lat, long){
    console.log("Called the setCoordinates function");
    console.log(lat);
    console.log(long);
    LatLong.push(lat, long);
    $location.path('/app/map')
  }
})

.controller('MapCtrl', function($scope, $state, $resource, $stateParams, $cordovaGeolocation, Route, Vehicle, LatLong) {
  var options = {timeout: 10000, enableHighAccuracy: true};
  
  var ll = LatLong.pop();
  $scope.lats = ll;
  console.log(ll.lat);
 
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
      animation: google.maps.Animation.DROP,
      position: latLng
      });
      var myMarker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: myLocation
      });
      var infoWindow = new google.maps.InfoWindow({
        content: "Here I am!"
      });

      google.maps.event.addListener(myMarker, 'click', function () {
          infoWindow.open($scope.map, myMarker);
      });
    });

    }, function(error){
      console.log("Could not get location");
    });
});