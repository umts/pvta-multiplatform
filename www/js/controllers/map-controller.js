angular.module('pvta.controllers').controller('MapController', function($scope, $state, $resource, $stateParams, $cordovaGeolocation, Route, Vehicle, LatLong, KML) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  //set original bounds
  var bounds = new google.maps.LatLngBounds();

  $scope.route = Route.get({routeId: $stateParams.routeId});
  $scope.vehicle = Vehicle.get({vehicleId: $stateParams.vehicleId});

  //set some configurable options before initializing map
  var mapOptions = {
    // bounds is originally the entire planet, so getCenter()
    // will return the intersection of the International Date Line
    // and Equator by default
    center: bounds.getCenter(),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  //initialize map
  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

  // Assuming the user has requested something
  // be placed on the map, grab the lat/long of that thing
  var desiredMarkerLocation = LatLong.getAll();
  if(desiredMarkerLocation){
    _.each(desiredMarkerLocation, function(location){

      // If our assumption was correct, query the Maps API
      // to get a valid, placeable location of our lat/long
      var loc = new google.maps.LatLng(location.lat, location.long);

      // Nested call: first, place the desired marker, then
      // add a listener for when it's tapped
      addBusListener(placeDesiredMarker(loc, 'http://www.google.com/mapfiles/kml/paddle/go.png'));
    });

  }

  // Almost the same as immediately above.
  // Query Cordova for current location first.
  // Also fits the bounds to include everything we've added/removed from them
  var currentLocation = $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    var myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    addMapListener(placeDesiredMarker(myLocation, 'http://www.google.com/mapfiles/kml/paddle/red-circle.png'), 'You are here!');
  }, function(error){});


  // Takes a google.maps.LatLng object and places a marker
  // on the map in the requested spot.
  // Returns a reference to said marker.
  function placeDesiredMarker(location, icon){
    var neededMarker = new google.maps.Marker({
        map: $scope.map,
        icon: icon,
        animation: google.maps.Animation.DROP,
        position: location
      });
      bounds.extend(location);
      $scope.map.fitBounds(bounds);
    return neededMarker;
  };

  // Takes an already-created Maps marker and
  // a string.
  // Creates an on-tap/click listener
  // that will display the onClickString
  // in a little popup when the marker is
  // tapped on.
  // Returns nothing.
  function addMapListener(marker, onClick){
    google.maps.event.addListener(marker, 'click', function () {
            var infoWindow = new google.maps.InfoWindow({
              content: onClick
            });
            infoWindow.open($scope.map, marker);
    });
  }

  //adds a listener specifically for buses (it otherwise)
  //will not allow you to access scope variables for things
  //like route name and vehicle number
  function addBusListener(marker){
    google.maps.event.addListener(marker, 'click', function () {
            var infoWindow = new google.maps.InfoWindow({
              content: "<div><h2>" + $scope.route.ShortName + "</h2></div>"
            });
            infoWindow.open($scope.map, marker);
    });
  }

  // Query the KML service to see
  // if previous controller wanted
  // us to display a route.
  var shortName = KML.pop();
  if(shortName) {
    // If something exists, we should
    // add the route's corresponding KML
    // to the Map.
    addKML(shortName);
  }

  // Takes an Avail ShortName.
  // Uses a Maps API call to add a trace of
  // any route (by downloading its KML file from PVTA/Avail)
  // to the Map.
  // Returns nothing.
  function addKML(shortName){
    var toAdd = 'http://bustracker.pvta.com/infopoint/Resources/Traces/route' + shortName + '.kml';
    var georssLayer = new google.maps.KmlLayer({
    url: toAdd
    });
    georssLayer.setMap($scope.map);
  };
});
