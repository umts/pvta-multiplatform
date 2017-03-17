import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import { AboutComponent } from '../about/about.component';
import { StorageSettingsComponent} from '../storage-settings/storage-settings.component';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsComponent {
  autoRefresh: string;
  constructor(public navCtrl: NavController, private storage: Storage) {
    storage.ready().then(() => {
      storage.get('autoRefresh').then(autoRefreshTiming => {
        if (autoRefreshTiming) {
          this.autoRefresh = autoRefreshTiming
        }
        else {
          this.autoRefresh = '45000';
        }
      });
    });
  }

  goToAboutPage() {
    this.navCtrl.push(AboutComponent)
  }
  goToStorageSettingsPage() {
    this.navCtrl.push(StorageSettingsComponent);
  }

  ionViewWillExit() {
    this.storage.ready().then(() => {
      this.storage.set('autoRefresh', this.autoRefresh);
    });
  }
}
