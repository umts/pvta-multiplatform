import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { MapService } from '../../providers/map.service';
import { StopService } from '../../providers/stop.service';

import { StopComponent } from '../stop/stop.component';

declare const google;

@Component({
  selector: 'page-nearby',
  templateUrl: 'nearby.html'
})
export class NearbyComponent {
  @ViewChild('map') mapElement: ElementRef;
  showBottomPanel: boolean = true;
  showBottomRightPanel: boolean = false;
  nearestStops;
  loadingStopsStatus: String;
  currentHighlightedStop;
  bounds;
  position;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public geolocation: Geolocation, private stopSvc: StopService,
  private alertCtrl: AlertController, private mapSvc: MapService) {
    // Get location, then get nearest stops and load the map
    const options = {timeout: 5000, enableHighAccuracy: true};
    this.geolocation.getCurrentPosition(options).then(position => {
      this.position = position;
      this.getNearestStops();
      this.loadMap();
    }).catch(err => {
      console.error(`No location ${err}`);
      this.loadingStopsStatus = 'Error retrieving location';
    });

    this.loadingStopsStatus = 'Loading stops near you';
  }

  loadMap() {
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
      this.mapSvc.downloadGoogleMaps(() => this.mapsLoadedCallback());
    } else {
      this.mapsLoadedCallback();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NearbyPage');
  }

  mapsLoadedCallback() {
    console.log('maps loaded');
    const location = new google.maps.LatLng(
      this.position.coords.latitude, this.position.coords.longitude
    );
    let mapOptions = {
      center: location,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      }
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    // These coordinates draw a rectangle around all PVTA-serviced area. Used to restrict requested locations to only PVTALand
    let swBound = new google.maps.LatLng(41.93335, -72.85809);
    let neBound = new google.maps.LatLng(42.51138, -72.20302);
    this.bounds = new google.maps.LatLngBounds(swBound, neBound);
    if (!this.bounds.contains(location)) {
      console.error('Can\'t Use Current Location',
      'Your current location isn\'t in the PVTA\'s service area. Please search for a starting location above.');
    }
  }

  onCollapseToggleClicked() {
    this.showBottomPanel = !this.showBottomPanel;
  }

  getNearestStops() {
    this.stopSvc.getNearestStops(this.position.coords.latitude, this.position.coords.longitude).then(stops => {
      this.nearestStops = stops.slice(0, 5);
    }).catch(err => {
      console.error(err);
      this.loadingStopsStatus = 'Error downloading stops';
    });
  }
  onShowRightPanelClick(stop: number) {
    this.showBottomRightPanel = !this.showBottomRightPanel;
    this.currentHighlightedStop = stop;
  }
  goToStopPage(stopId: number): void {
    this.navCtrl.push(StopComponent, {
      stopId: stopId
    }).catch(() => {
      this.alertCtrl.create({
        title: 'No Connection',
        subTitle: 'The Stop page requires an Internet connection',
        buttons: ['Dismiss']
      }).present();
    });
  }

}
