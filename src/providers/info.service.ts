import { Injectable } from '@angular/core';
import { ToastController} from 'ionic-angular';

@Injectable()
export class InfoService {
  private isIE: boolean;
  private ieToast;
  constructor(private toast: ToastController) {
    this.isIE = false;
  }

  getVersionNumber(): string {
    return '2.2.1';
  }

  getVersionName(): string {
    return 'PVTrAck Fall 2018';
  }

  setInternetExplorer(isIE: boolean): void {
    this.isIE = isIE;
    if (this.isIE === true) {
      if (this.ieToast) {
        this.ieToast.dismiss();
        this.ieToast = null;
      }
      this.ieToast = this.toast.create({
        message: `PVTrAck does not fully support Internet Explorer.
        For the best experience, please switch to
        Google Chrome or Microsoft Edge.`,
        duration: 10000
      });
      this.ieToast.present();
    }
  }

  isInternetExplorer(): boolean {
    return this.isIE;
  }

}
