import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
    private faveToast; 
    constructor(private toast: ToastController) { } 
  
  favoriteToast(routeOrStop: string, isFave: boolean): void {
    let txt = `${routeOrStop} ${isFave ? 'added' : 'removed'} from favorites`;
    this.faveToast = this.toast.create({message: txt, position: 'bottom', showCloseButton: true});
    this.faveToast.present();
  }
}
