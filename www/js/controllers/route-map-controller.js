angular.module('pvta.controllers').controller('RouteMapController', function($scope, $stateParams, Map, LatLong, KML, Route, RouteVehicles){
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
    var vehicleLocations = LatLong.getAll();
    _.each(vehicleLocations, function(location){

      var color, message;

      var loc = new google.maps.LatLng(location.lat, location.long);

      // Nested call: first, place the desired marker, then
      // add a listener for when it's tapped
      var vehicle = _.first(_.where($scope.vehicles, {Latitude: location.lat, Longitude: location.long}));
      if(vehicle.DisplayStatus === "On Time"){
        color = "green";
        message = "<h3 style='color: " + color + ";'>Bus " + vehicle.Name + " - " + vehicle.DisplayStatus + "</h3>";
      }
      else {
        color = "red";
        message = "<h3 style='color: " + color + ";'>Bus " + vehicle.Name + " - " + vehicle.DisplayStatus
          + " by " + vehicle.Deviation + " minutes</h3>";
      }

      var html = "<div style='font-family: Arial'><h2 style='color: #" + $scope.route.Color + "'>Route "+ $scope.route.ShortName
      + "</h2>" + message + "<h3>Last Stop: " + vehicle.LastStop + "</h3></div>"

      Map.addMapListener(Map.placeDesiredMarker(loc, 'http://www.google.com/mapfiles/kml/paddle/go.png'), html);
    });
  }

  $scope.$on('$ionicView.enter', function(){
    var shortName = KML.pop();
    if (shortName) {
      addKML(shortName);
    }
    $scope.route = Route.get({routeId: $stateParams.routeId}, function(){
      $scope.stops = $scope.route.Stops;
      $scope.vehicles = $scope.route.Vehicles;
      placeVehicles();
    });
  });


  function addKML (shortName) {
    var toAdd = 'http://bustracker.pvta.com/infopoint/Resources/Traces/route' + shortName + '.kml';
    var georssLayer = new google.maps.KmlLayer({
      url: toAdd
    });
    georssLayer.setMap($scope.map);
  }

});
