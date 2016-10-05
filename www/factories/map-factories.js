angular.module('pvta.factories')

.factory('Map', function ($cordovaGeolocation) {

  var map;
  var currentLocation;
  var options = { timeout: 5000, enableHighAccuracy: true };

  function placeDesiredMarker (location, icon) {
    var neededMarker = new google.maps.Marker({
      map: map,
      icon: icon,
      animation: google.maps.Animation.DROP,
      position: location
    });
    map.panTo(location);
    return neededMarker;
  }

  function plotCurrentLocation (cb) {
    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
      currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      addMapListener(placeDesiredMarker(currentLocation, 'https://www.google.com/mapfiles/kml/paddle/red-circle.png'),
        "<h4 style='color: #387ef5'>You are here!</h4>");
      if (cb) {
        cb(currentLocation);
      }
    }, function (err) {
      // Tell Google Analytics that a user doesn't have location
      ga('send', 'exception', 'location failed in the Map Factory; error: '+ err, false);
      if (cb) {
        cb(false);
      }
    });
    return currentLocation;
  }

  var windows = [];
  function addMapListener (marker, onClick) {
    google.maps.event.addListener(marker, 'click', function () {
      //this auto-closes any bubbles that may already be open
      //when you open another one, so that only one bubble can
      //be open at once
      _.each(windows, function (window) {
        window.close();
        windows.pop(window);
      });
      //infobubble is a utility class that is
      //much more styleable than Google's InfoWindow.
      //source located in www/bower_components/js-info-bubble
      var infoWindow = new google.maps.InfoWindow({
        content: onClick
      });
      windows.push(infoWindow);
      infoWindow.open(map, marker);
    });
  }

  function addKML (fileName) {
    var toAdd = 'https://bustracker.pvta.com/infopoint/Resources/Traces/' + fileName;
    var georssLayer = new google.maps.KmlLayer({
      url: toAdd
    });
    georssLayer.setMap(map);
  }


  return {
    placeDesiredMarker: placeDesiredMarker,
    init: function (incomingMap) {
      map = incomingMap;
    },
    plotCurrentLocation: plotCurrentLocation,
    addMapListener: addMapListener,
    addKML: addKML
  };
});
