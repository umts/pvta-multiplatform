import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
    private faveToast; 
    constructor(private toast: ToastController) { } 
    
    favoriteToast(routeOrStop: string, isFave: boolean): void {
        if (isFave){ 
          this.faveToast = this.toast.create({message: routeOrStop + ' added to Favorites', position: 'bottom', showCloseButton: true});
        }
        else this.faveToast = this.toast.create({message: routeOrStop + ' removed from Favorites', position: 'bottom', showCloseButton: true});
    this.faveToast.present();
    }
}
