import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { StopService } from '../../providers/stop.service';

@Component({
  selector: 'page-nearby',
  templateUrl: 'nearby.html'
})
export class NearbyComponent {
  showBottomPanel: boolean = true;
  nearestStops;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public geolocation: Geolocation, private stopSvc: StopService) {
    let options = {timeout: 5000, enableHighAccuracy: true};
    this.geolocation.getCurrentPosition(options).then(position => {
      this.stopSvc.getNearestStops(position.coords.latitude, position.coords.longitude).then(stops => {
        this.nearestStops = stops;
      }).catch(err => {
        console.error(err);
      });
    }).catch(err => {
      console.error(`No location ${err}`);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NearbyPage');
  }

  handleMapClick() {
    this.showBottomPanel = !this.showBottomPanel;
  }

  getNearestStops() {

  }

}
