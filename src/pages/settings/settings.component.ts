import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AboutComponent } from '../about/about.component';
import { StorageSettingsComponent} from '../storage-settings/storage-settings.component';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsComponent {

  constructor(public navCtrl: NavController) {

  }

  goToAboutPage() {
    this.navCtrl.push(AboutComponent)
  }
  goToStorageSettingsPage() {
    this.navCtrl.push(StorageSettingsComponent);
  }

}
