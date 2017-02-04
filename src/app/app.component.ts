import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { AboutComponent } from '../pages/about/about.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { MyBusesComponent } from '../pages/my-buses/my-buses.component';
import { PlanTripComponent } from '../pages/plan-trip/plan-trip.component';
import { PrivacyPolicyComponent } from '../pages/privacy-policy/privacy-policy.component';
import { RouteComponent } from '../pages/route/route.component';
import { RouteMapComponent } from '../pages/route-map/route-map.component';
import { RoutesAndStopsComponent } from '../pages/routes-and-stops/routes-and-stops.component';
import { SettingsComponent } from '../pages/settings/settings.component';
import { StopComponent } from '../pages/stop/stop.component';
import { StopMapComponent } from '../pages/stop-map/stop-map.component';
import { StorageSettingsComponent } from '../pages/storage-settings/storage-settings.component';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MyBusesComponent;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
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
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
