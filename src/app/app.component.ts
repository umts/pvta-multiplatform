import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { MyBusesComponent } from '../pages/my-buses/my-buses.component';
import { PlanTripComponent } from '../pages/plan-trip/plan-trip.component';
import { RoutesAndStopsComponent } from '../pages/routes-and-stops/routes-and-stops.component';
import { SettingsComponent } from '../pages/settings/settings.component';
import { ConnectivityService } from '../providers/connectivity.service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MyBusesComponent;
  offlineToast;
  pages: Array<{title: string, component: any}>;
  showNativeStoreAd = false;

  constructor(public platform: Platform,
  private connectivityService: ConnectivityService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'My Buses', component: MyBusesComponent },
      { title: 'Routes and Stops', component: RoutesAndStopsComponent },
      { title: 'Schedule', component: PlanTripComponent },
      { title: 'Settings', component: SettingsComponent }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      if (this.platform.is('android')) {
        StatusBar.backgroundColorByHexString('#1976D2');
      }
      this.showNativeStoreAd = this.platform.is('mobileweb') || this.platform.is('core');
      Splashscreen.hide();
      window.addEventListener('online', () =>  {
        console.log('online');
        this.connectivityService.setConnectionStatus(true);
      }, false);

      window.addEventListener('offline', () => {
        console.log('offline');
        this.connectivityService.setConnectionStatus(false);
      }, false);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
