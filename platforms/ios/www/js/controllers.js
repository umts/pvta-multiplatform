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

.controller('SearchCtrl', function($scope, $http){
  $scope.v = [];
  var all = [];
  $http.get('http://bustracker.pvta.com/infopoint/rest/vehicles/getallvehicles').
  then(function successCallback(response){
    $scope.v = response.data.sort(function(a, b){return a.Name - b.Name});
    all.push(response.data.sort(function(a, b){return a.Name - b.Name}));
  }, function errorCallback(response){
    console.log('An error! D:');
    console.log(response);
  });
  $http.get('http://bustracker.pvta.com/infopoint/rest/routes/getallroutes').
  then(function successCallback(response){
    $scope.r = response.data.sort(function(a, b){return a.ShortName - b.ShortName});
    all.push(response.data.sort(function(a, b){return a.ShortName - b.ShortName}));
  }, function errorCallback(response){
    console.log('uh oh');
  });
  $http.get('http://bustracker.pvta.com/infopoint/rest/stops/getallstops').
  then(function successCallback(response){
    $scope.s = response.data.sort(function(a, b){return a.Name - b.Name});
    all.push(response.data.sort(function(a, b){return a.Name - b.Name}));
  }, function errorCallback(response){
    console.log('uh oh');
  });
  $scope.a = all;
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

.controller('StopDeparturesController', function($scope, $stateParams, $http, $resource, moment){
  $scope.s = {};
  var s = $resource('http://bustracker.pvta.com/infopoint/rest/stopdepartures/get/:stopId');
  var x = s.query({stopId: $stateParams.stopId});
  $scope.s = x;
  $scope.init = function(sdt, edt){
    $scope.sdtString = moment(sdt).fromNow();
    $scope.edtString = moment(edt).fromNow();
    return {sdt: moment(sdt).fromNow(), edt: moment(edt).fromNow()}
  };
});
