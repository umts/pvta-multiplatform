import { Component } from '@angular/core';

import { NavController, Platform, NavParams, ModalController, ViewController } from 'ionic-angular';
import { Stop } from '../../models/stop.model';
import { StopComponent } from '../stop/stop.component';



@Component({
  templateUrl: 'stop.modal.html'
})
export class RouteStopModal {
  character;
  stops;
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public navCtrl: NavController
  ) {
    this.stops = this.params.get('stops');
    }

  goToStopPage(stopId: number): void {
    this.navCtrl.push(StopComponent, {
      stopId: stopId
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
