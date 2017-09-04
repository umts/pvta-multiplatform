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

  vehicleSVGPath(): string {
    return `M 100, 100
        m -75, 0
        a 75,75 0 1,0 150,0
        a 75,75 0 1,0 -150,0`
  }

}
