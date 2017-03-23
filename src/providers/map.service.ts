import { Injectable } from '@angular/core';
declare var google;

@Injectable()
export class MapService {

  constructor() {}
  map;
  currentLocation;
  options = { timeout: 5000, enableHighAccuracy: true };
  markers = [];
  windows = [];

  placeDesiredMarker(location, icon, isVehicleRefresh): any {
    var neededMarker = new google.maps.Marker({
      map: this.map,
      icon: icon,
      animation: google.maps.Animation.DROP,
      position: location
    });
    if (!isVehicleRefresh) {
      this.map.panTo(location);
    }
    this.markers.push(neededMarker);
    return neededMarker;
  }

  removeAllMarkers(): void {
    for (let marker of this.markers) {
      marker.setMap(null);
    }
    this.markers = [];
  }

  // plotCurrentLocation(cb): void {
  //   $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
  //     currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //     addMapListener(placeDesiredMarker(currentLocation, 'https://www.google.com/mapfiles/kml/paddle/red-circle.png'),
  //       "<h4 style='color: #387ef5'>You are here!</h4>");
  //     if (cb) {
  //       cb(currentLocation);
  //     }
  //   }, function (err) {
  //     showInsecureOriginLocationPopup(err);
  //     // Tell Google Analytics that a user doesn't have location
  //     ga('send', 'event', 'LocationFailure', '$cordovaGeolocation.getCurrentPosition', 'location failed in the Map Factory; error: ' + err.message);
  //     if (cb) {
  //       cb(false);
  //     }
  //   });
  //   return currentLocation;
  // }

   addMapListener (marker, onClick) {
    google.maps.event.addListener(marker, 'click', () => {
      // This auto-closes any bubbles that may already be open
      // when you open another one, so that only one bubble can
      // be open at once
      for (let window of this.windows) {
        window.close();
      }
      this.windows = [];
      // Create the new InfoWindow, and show it!
      let infoWindow = new google.maps.InfoWindow({
        content: onClick
      });
      this.windows.push(infoWindow);
      infoWindow.open(this.map, marker);
    });
  }

  addKML (fileName) {
    let toAdd = 'https://bustracker.pvta.com/infopoint/Resources/Traces/' + fileName;
    let georssLayer = new google.maps.KmlLayer({
      url: toAdd
    });
    georssLayer.setMap(this.map);
  }

  // getCurrentPosition () {
  //   return $cordovaGeolocation.getCurrentPosition(options);
  // }

  init(incomingMap): void {
    this.map = incomingMap;
  }
  // A well-known svg 'path.' When rendered, it draws a bus!
  busSVGPath(): string {
    return 'M0,0 350,700 700,0 350,150z';
  }

}
