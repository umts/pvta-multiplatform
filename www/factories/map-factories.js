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
      ga('send', 'event', 'LocationFailure', '$cordovaGeolocation.getCurrentPosition', 'location failed in the Map Factory; error: '+ err.msg);
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
    addKML: addKML,
    busSVGPath: 'M 367.524,92.122 C -4.208,-21.045,-17.678,-29.463,-37.882,-37.882 C -19.918,-8.299,-67.648,-18.22,9-102.872,-18.507 C 191.548,36.012,143.819,45.941,123.9,54.24 C -20.204,8.418,-33.673,16.836,-37.882,37.882 L 70.866,208.794 V 369.56 h 26.096 v 25.211 c 0,30.739,44.984,30.739,44.984,0 V 369.56 h 83.048 h 0.263 h 86.341 v 25.211 c 0,30.739,44.983,30.739,44.983,0 V 369.56 h 26.096 V 208.794 L 367.524,92.122 z M 162.625,65.184 h 62.631 h 65.662 c 12.628,0,12.628,18.941,0,18.941 h -65.815 h -62.478 C 149.997,84.125,149.997,65.184,162.625,65.184 z M 119.472,319.162 c -11.918,0,-21.58,-9.662,-21.58,-21.58 s 9.662,-21.579,21.58,-21.579 s 21.58,9.661,21.58,21.579 S 131.39,319.162,119.472,319.162 z  M 225.256,221.09 H 110.797 c -11.206,0,-13.552,-8.051,-12.452,-16.162 l 11.793,-84.621 c 1.62,-10.281,5.105,-17.059,18.444,-17.059 h 96.521 h 99.857 c 13.34,0,16.824,6.778,18.443,17.059 l 11.795,84.621 c 1.1,8.111,-1.246,16.162,-12.452,16.162 H 225.256 z M 334.07,319.162 c -11.918,0,-21.579,-9.662,-21.579,-21.58 s 9.661,-21.579,21.579,-21.579 s 21.579,9.661,21.579,21.579 S 345.988,319.162,334.07,319.162 z'
  };
});
