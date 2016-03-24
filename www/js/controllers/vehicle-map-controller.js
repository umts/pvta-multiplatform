angular.module('pvta.controllers').controller('VehicleMapController', function($scope, Map, LatLong){
  var bounds = new google.maps.LatLngBounds();

  var mapOptions = {
    center: new google.maps.LatLng(42.386270, -72.525844),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
  Map.init($scope.map, bounds);


  function placeVehicle(){
    var vehicle = LatLong.getAll();
    var loc = new google.maps.LatLng(vehicle[0].lat, vehicle[0].long);
    Map.addMapListener(Map.placeDesiredMarker(loc, 'http://www.google.com/mapfiles/kml/paddle/go.png'), 'Here is your vehicle!');
  }

  $scope.$on('$ionicView.enter', function () {
    Map.plotCurrentLocation();
    placeVehicle();
  });

})
