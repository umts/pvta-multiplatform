import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, ToastController, Toast, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-storage-settings',
  templateUrl: 'storage-settings.html'
})
export class StorageSettingsComponent {
  toast: Toast;
  constructor(public navCtrl: NavController, private storage: Storage,
  private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  showToast(message: string): void {
    if (this.toast) {
      this.toast.dismissAll();
    }

    this.toast = this.toastCtrl.create({
      message: message,
      position: 'bottom',
      showCloseButton: true,
      dismissOnPageChange: true
      });
    this.toast.present();
  }

  clearFavoriteRoutes(): void {
    this.storage.ready().then(() => {
      this.storage.remove('favoriteRoutes');
      this.showToast('Removed your favorite routes');
    });
  }
  clearFavoriteStops(): void {
    this.storage.ready().then(() => {
      this.storage.remove('favoriteStops');
      this.showToast('Removed your favorite stops');
    });
  }
  clearRoutes(): void {
    this.storage.ready().then(() => {
      this.storage.remove('routes');
      this.showToast('Removed the saved list of routes');
    });
  }
  clearStops(): void {
    this.storage.ready().then(() => {
      this.storage.remove('stops');
      this.showToast('Removed the saved list of stops');
    });
  }
  clearAll(): void {
    let alert = this.alertCtrl.create({
      title: 'Remove All Data?',
      message: 'Are you sure?  This removes all your favorites and cannot be undone.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.storage.ready().then(() => {
              this.storage.clear();
              this.showToast('Removed all saved data');
            });
          }
        }
      ]
    });
    alert.present();
  }
}
