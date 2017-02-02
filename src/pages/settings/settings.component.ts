import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsComponent {

  constructor(public navCtrl: NavController) {

  }

  goToPg() {
    this.navCtrl.push(AboutComponent)
  }

}
