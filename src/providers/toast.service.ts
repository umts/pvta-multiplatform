import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
    private faveToast; 
    constructor(private toast: ToastController) { } 

  let txt = `${routeOrStop} ${isFave ? 'added' : 'removed'} from favorites`;
  this.toast.create({message: txt, position: 'bottom', showCloseButton: true});
  this.toast.present();
}
