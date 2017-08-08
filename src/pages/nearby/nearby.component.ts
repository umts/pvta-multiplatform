import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Nearby page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-nearby',
  templateUrl: 'nearby.html'
})
export class NearbyComponent {
  showBottomPanel: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad NearbyPage');
  }

  handleMapClick() {
    this.showBottomPanel = !this.showBottomPanel;
  }

}
