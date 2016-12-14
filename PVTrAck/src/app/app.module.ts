import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { About } from '../pages/about/about';
import { Contact } from '../pages/contact/contact';
import { MyBuses } from '../pages/my-buses/my-buses';
import { PlanTrip } from '../pages/plan-trip/plan-trip';
import { PrivacyPolicy } from '../pages/privacy-policy/privacy-policy';
import { Route } from '../pages/route/route';
import { RouteMap } from '../pages/route-map/route-map';
import { RoutesAndStops } from '../pages/routes-and-stops/routes-and-stops';
import { Settings } from '../pages/settings/settings';
import { Stop } from '../pages/stop/stop';
import { StopMap } from '../pages/stop-map/stop-map';
import { StorageSettings } from '../pages/storage-settings/storage-settings';


@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
