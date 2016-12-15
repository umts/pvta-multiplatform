import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {Http, Response} from '@angular/http'


@Component({
  selector: 'page-routes-and-stops',
  templateUrl: 'routes-and-stops.html'
})
export class RoutesAndStops {
  constructor(public navCtrl: NavController, public http: Http) {
    this.poo();
  }
  private routesUrl = 'http://bustracker.pvta.com/infopoint/rest/routes/getvisibleroutes';  // URL to web API

  poo() {
    this.http.get('http://bustracker.pvta.com/infopoint/rest/routes/get/20030')
      .subscribe(
        data => {
          let x: StopDeparture = data.json() as StopDeparture;
          console.log(x)
        },
        err => console.log(err),
        () => console.log('Random Quote Complete')
      );
    }
}
