import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
    private faveToast; 
    constructor(private toast: ToastController) { } 
    
    favoriteToast(isFave: boolean): void {
        if (isFave){ 
          this.faveToast = this.toast.create({message:'Added to favorites', position: 'bottom', showCloseButton: true});
        }
        else this.faveToast = this.toast.create({message:'Removed from favorites', position: 'bottom', showCloseButton: true});
    this.faveToast.present();
    }
}
