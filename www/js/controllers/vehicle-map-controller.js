angular.module('pvta.controllers').controller('VehicleMapController', function ($scope, $stateParams, Map, LatLong, Vehicle, SimpleRoute, KML) {
  var bounds = new google.maps.LatLngBounds();

  var mapOptions = {
    center: new google.maps.LatLng(42.386270, -72.525844),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  Map.init($scope.map, bounds);


  function placeVehicle (vehicle, route) {
    var vehicleLocation = _.first(LatLong.getAll());
    var loc = new google.maps.LatLng(vehicleLocation.lat, vehicleLocation.long);
    var color, message;
    //This content has been commented out for the Beta 3 release. It will hopefully be finished
    //before the actual release but no promises.

    //vehicle is the vehicle that we are currently looking at, as given to us by LatLong
    //if the vehicle is on time, make the text green. If it's late, make the text red and say late by how much
    /*if (vehicle.DisplayStatus === 'On Time') {
      color = 'green';
      message = '<h4 style=\'color: ' + color + ';\'>Bus ' + vehicle.Name + ' - ' + vehicle.DisplayStatus + '</h4>';
    }
    else {
      color = 'red';
      message = '<h4 style=\'color: ' + color + ';\'>Bus ' + vehicle.Name + ' - ' + vehicle.DisplayStatus
        + ' by ' + vehicle.Deviation + ' minutes</h4>';
    }*/

    //sets the content of the window to have a ton of information about the vehicle
    //var content = '<div style=\'font-family: Arial;text-align: center\'><h3 style=\'color: #' + route.Color + "'>" +
    //route.ShortName + ': ' + vehicle.Destination + '</h3>' + message + '<h4>Last Stop: ' + vehicle.LastStop + '</h4></div>';
    //console.log(content);

    var content = "<h4 style='color: #387ef5'>Here is your bus!</h4>";

    //add a listener for that vehicle with that content as part of the infobubble
    Map.addMapListener(Map.placeDesiredMarker(loc, 'http://www.google.com/mapfiles/kml/paddle/go.png'), content);
  }

  $scope.$on('$ionicView.enter', function () {
    Map.plotCurrentLocation();
    var fileName = KML.pop();
    if(fileName)
      Map.addKML(fileName);
    vehicle = Vehicle.get({vehicleId: $stateParams.vehicleId}, function(){
      placeVehicle(vehicle);
    });
  });

});
