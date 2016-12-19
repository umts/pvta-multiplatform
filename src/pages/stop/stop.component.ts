import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { StopDeparture } from '../../models/stop-departure.model';
import { StopDepartureService } from '../../services/stop-departure.service';

@Component({
  selector: 'page-stop',
  templateUrl: 'stop.html'
})
export class Stop {
  departures: StopDeparture[];
  constructor(public navCtrl: NavController,
    private stopDepartureService: StopDepartureService) {

  }

}
