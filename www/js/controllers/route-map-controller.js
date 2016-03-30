angular.module('pvta.controllers').controller('RouteMapController', function ($scope, Map, LatLong, KML) {
  var bounds = new google.maps.LatLngBounds();

  var mapOptions = {
    center: bounds.getCenter(),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  Map.init($scope.map, bounds);

  Map.plotCurrentLocation();

  function placeVehicles () {
  //places every vehicle on said route on the map
    var vehicles = LatLong.getAll();
    _.each(vehicles, function (location) {

      var loc = new google.maps.LatLng(location.lat, location.long);

      // Nested call: first, place the desired marker, then
      // add a listener for when it's tapped
      Map.addMapListener(Map.placeDesiredMarker(loc, 'http://www.google.com/mapfiles/kml/paddle/go.png'), 'Here is your bus');
    });
  }

  $scope.$on('$ionicView.enter', function () {
    placeVehicles();
    var shortName = KML.pop();
    if (shortName) {
      addKML(shortName);
    }
  });


  function addKML (shortName) {
    var toAdd = 'http://bustracker.pvta.com/infopoint/Resources/Traces/route' + shortName + '.kml';
    var georssLayer = new google.maps.KmlLayer({
      url: toAdd
    });
    georssLayer.setMap($scope.map);
  }

});
