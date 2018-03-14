import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
    private faveToast;
    private toastHandle;
    private originDestination;
    private noLocation;
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
  noOriginOrDestinationToast(): void{
    if (this.originDestination) {
      this.originDestination.dismiss();
    }
    let txt = 'You must select an origin and destination from the autocomplete dropdowns above in order to search the schedule';
    this.originDestination = this.toast.create({message: txt, position: 'bottom', showCloseButton: true});
    this.originDestination.present();
  }
  noLocationToast(): void{
    if (this.noLocation) {
      this.noLocation.dismiss();
    }
    let txt = 'Unable to retrieve current location'
    this.noLocation = this.toast.create({message: txt, position: 'bottom', showCloseButton: true});
    this.noLocation.present();
  }
}
