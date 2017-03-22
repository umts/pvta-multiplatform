import { Injectable } from '@angular/core';
import { ToastController} from 'ionic-angular';

@Injectable()
export class ConnectivityService {

  connected: boolean;
  offlineToast;

  constructor(private toast: ToastController) { }

  setConnectionStatus(connected: boolean) {
    this.connected = connected;
    if (this.connected == true && this.offlineToast) {
      this.offlineToast.dismiss();
      this.offlineToast = null;
    }
    else if (this.connected == false && !this.offlineToast) {
      this.offlineToast = this.toast.create({
        message: 'No network connection. Check connection settings.'
      });
      this.offlineToast.present();
    }
  }

  getConnectionStatus(): boolean {
    return this.connected;
  }
}
