import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
    private faveToast; 
    constructor(private toast: ToastController) { } 
    
    favoriteToast(isFave: boolean): void {
        if (isFave){ 
          this.faveToast = this.toast.create({message:'Added to favorites'});
        }
        else this.faveToast = this.toast.create({message:'Removed from favorites'});
    this.faveToast.present();
    }
}
