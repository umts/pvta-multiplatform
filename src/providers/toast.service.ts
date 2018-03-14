import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
    private faveToast;
    private toastHandle;
    constructor(private toast: ToastController) { }

  toastHandler(text: string): void{
    let txt = text;
    this.toastHandle = this.toast.create({message: txt, position: 'bottom', showCloseButton: true});
    this.toastHandle.present();
  }
  favoriteToast(routeOrStop: string, isFave: boolean): void {
    if (this.faveToast) {
      this.faveToast.dismiss();
    }
    let txt = `${routeOrStop} ${isFave ? 'added to' : 'removed from'} Favorites`;
    this.faveToast = this.toast.create({message: txt, position: 'bottom', showCloseButton: true});
    this.faveToast.present();
  }
}
