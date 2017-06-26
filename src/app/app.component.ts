import { Component, ViewChild } from '@angular/core';
import { Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FavoritesComponent } from '../pages/my-buses/my-buses.component';
import { PlanTripComponent } from '../pages/plan-trip/plan-trip.component';
import { RoutesAndStopsComponent } from '../pages/routes-and-stops/routes-and-stops.component';
import { SettingsComponent } from '../pages/settings/settings.component';
import { ConnectivityService } from '../providers/connectivity.service';
import { InfoService } from '../providers/info.service';
import { performMigrations} from './storage';
import { Storage } from '@ionic/storage';

declare var ga;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = FavoritesComponent;
  offlineToast;
  pages: Array<{title: string, component: any}>;
  runningInBrowser = false;

  constructor(public platform: Platform, private infoSvc: InfoService,
  private connectivityService: ConnectivityService, private storage: Storage,
  private statusBar: StatusBar, private splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'My Buses', component: FavoritesComponent },
      { title: 'Routes and Stops', component: RoutesAndStopsComponent },
      { title: 'Schedule', component: PlanTripComponent },
      { title: 'Settings', component: SettingsComponent }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('initializeApp');
      this.statusBar.styleDefault();
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString('#1976D2');
      }
      let isIE: boolean = navigator.userAgent.indexOf('Trident', 0) !== -1;
      this.infoSvc.setInternetExplorer(isIE);
      this.runningInBrowser = this.platform.is('mobileweb') || this.platform.is('core');
      // Listen for the app install banner interactions
      if (this.runningInBrowser) {
        window.addEventListener('beforeinstallprompt', this.onInstallPromptShown);
      }
      this.splashScreen.hide();
      // Must use document for pause/resume, and window for on/offline.
      // Great question.
      document.addEventListener('pause', this.onAppPause);
      document.addEventListener('resume', this.onAppResume);
      window.addEventListener('offline', this.onDeviceOffline, false);
      window.addEventListener('online', this.onDeviceOnline, false);
    });
    performMigrations(this.runningInBrowser, this.storage);
  }

  onAppPause = () => {
    // Don't keep listening for network events when we're not active
    console.log('App: pause');
    window.removeEventListener('offline', this.onDeviceOffline);
    window.removeEventListener('online', this.onDeviceOnline);
  }

  onAppResume = () => {
    console.log('App: resume');
    window.addEventListener('offline', this.onDeviceOffline, false);
    window.addEventListener('online', this.onDeviceOnline, false);
  }
  onDeviceOffline = () => {
    console.log('App: offline');
    this.connectivityService.setConnectionStatus(false);
  }
  onDeviceOnline = () => {
    console.log('App: online');
    this.connectivityService.setConnectionStatus(true);
  }
  onInstallPromptShown = (e: any) => {
    // beforeinstallprompt event fired
    // e.userChoice will return a Promise.
    e.userChoice.then(choiceResult => {
      ga('send', 'event', 'Native App Install Banner Interaction',
      'AppComponent.initializeApp()', choiceResult.outcome);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
