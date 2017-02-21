import { Component } from '@angular/core';

import { NavController, Platform, NavParams, ModalController, ViewController } from 'ionic-angular';
import { RouteService } from '../../services/route.service';
import { VehicleService } from '../../services/vehicle.service';
import { AlertService } from '../../services/alert.service';
import { RouteDetail } from '../../models/route-detail.model';
import { Vehicle } from '../../models/vehicle.model';
import { Alert } from '../../models/alert.model';
import { Stop } from '../../models/stop.model';
import { VehicleComponent } from './vehicle.component';
import * as _ from 'lodash';

@Component({
  templateUrl: 'stop.modal.html'
})
export class StopModal {
  character;
  stops;
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.stops = this.params.get('stops');
    var characters = [
      {
        name: 'Gollum',
        quote: 'Sneaky little hobbitses!',
        image: 'assets/img/avatar-gollum.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'River Folk' },
          { title: 'Alter Ego', note: 'Smeagol' }
        ]
      },
      {
        name: 'Frodo',
        quote: 'Go back, Sam! I\'m going to Mordor alone!',
        image: 'assets/img/avatar-frodo.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'Shire Folk' },
          { title: 'Weapon', note: 'Sting' }
        ]
      },
      {
        name: 'Samwise Gamgee',
        quote: 'What we need is a few good taters.',
        image: 'assets/img/avatar-samwise.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'Shire Folk' },
          { title: 'Nickname', note: 'Sam' }
        ]
      }
    ];
    this.character = characters[this.params.get('charNum')];
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
