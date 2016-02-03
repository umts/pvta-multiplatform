angular.module('pvta.controllers').controller('MapController', function($scope, $state, $resource, $stateParams, $cordovaGeolocation, Route, Vehicle, LatLong) {
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