angular.module('pvta.controllers').controller('StopMapController', function($scope, Map, LatLong){
  var bounds = new google.maps.LatLngBounds();

  var mapOptions = {
    center: bounds.getCenter(),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
  Map.init($scope.map, bounds);

  Map.plotCurrentLocation();

  function placeStop(){
    var stop = LatLong.getAll();
    _.each(stop, function(location){
      var loc = new google.maps.LatLng(location.lat, location.long);
      Map.addMapListener(Map.placeDesiredMarker(loc, 'http://www.google.com/mapfiles/kml/paddle/go.png'), 'Here is your stop!');
    })
  }

  $scope.$on('$ionicView.enter', function () {
    placeStop();
  });

})
