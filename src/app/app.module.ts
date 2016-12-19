// Angular, Ionic, and their related components
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Pages
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

// Services
import { RouteService }          from '../services/route.service';
import { StopService }          from '../services/stop.service';
import { StopDepartureService }          from '../services/stop-departure.service';



@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    About,
    Contact,
    MyBuses,
    PlanTrip,
    PrivacyPolicy,
    Route,
    RouteMap,
    RoutesAndStops,
    Settings,
    Stop,
    StopMap,
    StorageSettings
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    About,
    Contact,
    MyBuses,
    PlanTrip,
    PrivacyPolicy,
    Route,
    RouteMap,
    RoutesAndStops,
    Settings,
    Stop,
    StopMap,
    StorageSettings
  ],
  providers: [ {provide: ErrorHandler, useClass: IonicErrorHandler},
    RouteService, StopService, StopDepartureService ]
})
export class AppModule {}
