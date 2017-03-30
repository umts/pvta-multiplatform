import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import { AboutComponent } from '../about/about.component';
import { ContactComponent} from '../contact/contact.component';
import { StorageSettingsComponent} from '../storage-settings/storage-settings.component';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsComponent {
  autoRefresh: string;
  isInternetExplorer: boolean = false;
  constructor(public navCtrl: NavController, private storage: Storage) {
    this.isInternetExplorer = navigator.userAgent.indexOf('Trident', 0) !== -1;
    storage.ready().then(() => {
      storage.get('autoRefresh').then(autoRefreshTiming => {
        if (autoRefreshTiming) {
          this.autoRefresh = autoRefreshTiming;
        } else {
          this.autoRefresh = '45000';
        }
      });
    });
  }
  goToAboutPage() {
    this.navCtrl.push(AboutComponent);
  }
  goToStorageSettingsPage() {
    this.navCtrl.push(StorageSettingsComponent);
  }
  goToContactPage(): void {
    this.navCtrl.push(ContactComponent);
  }
  ionViewWillLeave() {
    this.storage.ready().then(() => {
      console.log('setting autorefresh to', this.autoRefresh);
      this.storage.set('autoRefresh', this.autoRefresh);
    });
  }
}
