import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

declare var google;
declare const ENV;
@Injectable()
export class MapService {
  map;

  gmaps_key;
  currentLocation;
  options = { timeout: 5000, enableHighAccuracy: true };
  markers = [];
  windows = [];
  constructor(public platform: Platform) {}

  downloadGoogleMaps(cb: Function) {
    window['mapsCb'] = cb;
    let head = document.getElementsByTagName('head')[0];
    let mapsApi = document.createElement('script');
    if (ENV.environment === 'dev') {
      this.gmaps_key = ENV.gmaps_dev;
    } else {
      if (this.platform.is('core') || this.platform.is('mobileweb')) {
        this.gmaps_key = ENV.gmaps_core;
      } else if (this.platform.is('ios')) {
        this.gmaps_key = ENV.gmaps_ios;
      } else {
        this.gmaps_key = ENV.gmaps_android;
      }
    }
    mapsApi.src = `https://maps.googleapis.com/maps/api/js?libraries=places,geometry&key=${this.gmaps_key}&callback=mapsCb`;
    head.appendChild(mapsApi);
  }

  dropPin(location): any {
    this.map.panTo(location);
    return new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: location
    });
  }

  placeVehicleMarker(location, icon, isVehicleRefresh): any {
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

  // Open only one infoWindow at a time
  addMapListener (marker, onClick) {
    google.maps.event.addListener(marker, 'click', () => {
      for (let window of this.windows) {
        window.close();
      }
      this.windows = [];
      let infoWindow = new google.maps.InfoWindow({
        content: onClick
      });
      this.windows.push(infoWindow);
      infoWindow.open(this.map, marker);
    });
  }

  addKML (fileName) {
    let toAdd = `https://bustracker.pvta.com/infopoint/Resources/Traces/${fileName}`;
    let georssLayer = new google.maps.KmlLayer({
      url: toAdd,
      suppressInfoWindows: true
    });
    georssLayer.setMap(this.map);
  }

  init(incomingMap): void {
    this.map = incomingMap;
  }
  // When rendered, it draws a triangle!
  busSVGPath(): string {
    return 'M0,0 350,700 700,0 350,150z';
  }

}
