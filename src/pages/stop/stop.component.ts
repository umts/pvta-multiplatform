import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { StopDeparture } from '../../models/stop-departure.model';
import { StopDepartureService } from '../../services/stop-departure.service';

@Component({
  selector: 'page-stop',
  templateUrl: 'stop.html'
})
export class StopComponent {
  departures: StopDeparture[];
  constructor(public navCtrl: NavController,
    private stopDepartureService: StopDepartureService) { }

    ngOnInit(): void {
      // NEED STOP ID BEFORE UNCOMMENTING!
        // this.stopDepartureService
        // .getStopDeparture(navParams.stopId)
        // .then(departures => this.departures = departures);
      }
}