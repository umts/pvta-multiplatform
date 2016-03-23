angular.module('pvta.controllers').controller('StopMapController', function($scope, Map, LatLong){
  var bounds = new google.maps.LatLngBounds();
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();

  var mapOptions = {
    center: bounds.getCenter(),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
  Map.init($scope.map, bounds);


  function placeStop(){
    var stopLocation = _.first(LatLong.getAll());
    var loc = new google.maps.LatLng(stopLocation.lat, stopLocation.long);
    Map.addMapListener(Map.placeDesiredMarker(loc), 'Here is your stop!');
    return loc;
  }

  function calculateDirections(){
    var cb = function(position){
      start = position
      var end = placeStop();
      var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.WALKING
      };
      directionsService.route(request, function(result, status){
        if(status == google.maps.DirectionsStatus.OK){
          directionsDisplay.setDirections(result);
        }
      });
    }
    Map.plotCurrentLocation(cb);
  }

  $scope.$on('$ionicView.enter', function () {
    directionsDisplay = new google.maps.DirectionsRenderer();
    calculateDirections();
    directionsDisplay.setMap($scope.map);
    //directionsDisplay.setPanel(document.getElementById("right-panel"));
  });

})
