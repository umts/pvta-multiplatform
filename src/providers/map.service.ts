import { Injectable } from '@angular/core';
declare var google;
declare const ENV;
import * as _ from 'lodash';

@Injectable()
export class MapService {
  map;

  currentLocation;
  options = { timeout: 5000, enableHighAccuracy: true };
  private markers = [];
  windows = [];
  private kmlLayers = [];
  constructor() {}

  getMarkers() {
    return this.markers;
  }

  downloadGoogleMaps(cb: Function) {
    window['mapsCb'] = cb;
    let head = document.getElementsByTagName('head')[0];
    let mapsApi = document.createElement('script');
    mapsApi.src = `https://maps.googleapis.com/maps/api/js?libraries=places,geometry&key=${ENV.gmaps_key}&callback=mapsCb`;
    head.appendChild(mapsApi);
  }

  placeCurrentLocationMarker(location) {
    let marker = new google.maps.Marker({
      map: this.map,
      position: location,
      icon: 'assets/location-circle.png'
    });
    // this.markers.push(marker);
    return marker;
  }

  dropPin(location, keepBounds?: boolean, noAnimation?: boolean, iconURL?: any, label?: any): any {
    if (!keepBounds) {
      this.map.panTo(location);
    }
    let marker = new google.maps.Marker({
      map: this.map,
      animation: noAnimation ? false : google.maps.Animation.DROP,
      position: location,
      icon: iconURL ? iconURL : null,
      label: label
    });
    this.markers.push(marker);
    return marker;
  }

  placeCustomMarker(location, icon): any {
    var neededMarker = new google.maps.Marker({
      map: this.map,
      icon: icon,
      position: location
    });
    this.markers.push(neededMarker);
    return neededMarker;
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

  addMapListener (marker, onClick, disableAutoPan?: boolean) {
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
        content: onClick,
        disableAutoPan: disableAutoPan
      });
      this.windows.push(infoWindow);
      infoWindow.open(this.map, marker);
    });
  }

  toggleKMLs(fileNames: string[], preserveViewport?: boolean) {
    for (let file of fileNames) {
      if (this.layerIsOnMap(file)) {
        this.removeKML(file);
      } else {
        this.addKML(file, true);
      }
    }
  }

  addKML (fileName, preserveViewport?: boolean) {
    let toAdd = `https://bustracker.pvta.com/infopoint/Resources/Traces/${fileName}`;
    let georssLayer = new google.maps.KmlLayer({
      url: toAdd,
      suppressInfoWindows: true,
      preserveViewport: preserveViewport
    });
    this.kmlLayers.push({layer: georssLayer, fileName: fileName});
    georssLayer.setMap(this.map);
  }

  getKMLLayers() {
    return this.kmlLayers;
  }

  layerIsOnMap (fileName): boolean {
    if (this.kmlLayers.map(l => l.fileName).includes(fileName)) {
      return true;
    } else {
      return false;
    }
  }


  removeKML(fileName: string) {
    const removedLayers: any[] = _.remove(this.kmlLayers, l => l.fileName === fileName);
    for (let remove of removedLayers) {
      remove.layer.setMap(null);
    }
  }

  init(incomingMap): void {
    this.map = incomingMap;
  }
  // When rendered, it draws a triangle!
  busSVGPath(): string {
    return 'M0,0 350,700 700,0 350,150z';
  }

  busStopSVGPath(): string {
    return `M 100, 100
        m -75, 0
        a 75,75 0 1,0 150,0
        a 75,75 0 1,0 -150,0`;
  }
  vehicleSVGPath(): string {
    // return `M 400, 500 A 50, 50 0 1, 1 350, 100 L 400, 0 L 450, 100 A 50, 50 0 1, 1 400, 500z`;
    // return `M32 48 L48 53 L48 32 L32 16 L16 32 L16 53 Z`;
    return 'M32.09090909090909 0.2727272727272734 L48.45454545454545 15.818181818181817 Q57.18181818181819 47.90909090909091 32.18181818181818 48.09090909090909 T15.363636363636363 16.09090909090909 Z';
  }


}
