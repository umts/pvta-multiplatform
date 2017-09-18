import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
    private faveToast;
    private noLocationToast;
    private directToast;
    private directionStatus;
    private originDestination;
    constructor(private toast: ToastController) { }

  favoriteToast(routeOrStop: string, isFave: boolean): void {
    if (this.faveToast) {
      this.faveToast.dismiss();
    }
    let txt = `${routeOrStop} ${isFave ? 'added to' : 'removed from'} Favorites`;
    this.faveToast = this.toast.create({message: txt, position: 'bottom', showCloseButton: true});
    this.faveToast.present();
  }
  locationToast():void{
    let txt = 'Unable to retrieve current location';
    this.noLocationToast = this.toast.create({message: txt, position: 'bottom', showCloseButton: true});
    this.noLocationToast.present();
  }
  directionToast():void{
    let txt = 'Cannot get directions to this stop. Please ensure location services are enabled.';
    this.directToast = this.toast.create({message: txt, position: 'bottom', showCloseButton: true});
    this.directToast.present();
  }
  statusDirection(status: string): void{
    let txt = `Couldn't get directions to this stop. Status code ${status}`;
    this.directionStatus = this.toast.create({message: txt, position: 'bottom', showCloseButton: true});
    this.directionStatus.present();
  }
  noOriginOrDestinationToast(): void{
    let txt = 'You must select an origin and destination from the autocomplete dropdowns above in order to search the schedule';
    this.originDestination = this.toast.create({message: txt, position: 'bottom', showCloseButton: true});
    this.originDestination.present();
  }
}
