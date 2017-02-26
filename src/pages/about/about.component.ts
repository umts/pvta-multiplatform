import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { InfoService } from '../../providers/info.service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutComponent {

  versionName;
  versionNumber;

  constructor(public navCtrl: NavController, private infoService: InfoService) {
    this.versionName = infoService.getVersionName();
    this.versionNumber = infoService.getVersionNumber();
  }

}
