import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { InfoService } from '../../providers/info.service';
import { ContactComponent} from '../contact/contact.component';

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
  goToContactPage(): void {
    this.navCtrl.push(ContactComponent);
  }
}
