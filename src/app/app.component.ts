import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { About } from '../pages/about/about.component';
import { Contact } from '../pages/contact/contact.component';
import { MyBuses } from '../pages/my-buses/my-buses.component';
import { PlanTrip } from '../pages/plan-trip/plan-trip.component';
import { PrivacyPolicy } from '../pages/privacy-policy/privacy-policy.component';
import { Route } from '../pages/route/route.component';
import { RouteMap } from '../pages/route-map/route-map.component';
import { RoutesAndStops } from '../pages/routes-and-stops/routes-and-stops.component';
import { Settings } from '../pages/settings/settings.component';
import { Stop } from '../pages/stop/stop.component';
import { StopMap } from '../pages/stop-map/stop-map.component';
import { StorageSettings } from '../pages/storage-settings/storage-settings.component';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Page1;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Page One', component: Page1 },
      { title: 'Page Two', component: Page2 },
      { title: 'My Buses', component: MyBuses },
      { title: 'Routes and Stops', component: RoutesAndStops },
      { title: 'Schedule', component: PlanTrip },
      { title: 'Settings', component: Settings }
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
