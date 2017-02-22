// Angular, Ionic, and their related components
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';

// Pages
import { AboutComponent } from '../pages/about/about.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { MyBusesComponent } from '../pages/my-buses/my-buses.component';
import { PlanTripComponent } from '../pages/plan-trip/plan-trip.component';
import { PrivacyPolicyComponent } from '../pages/privacy-policy/privacy-policy.component';
import { RouteComponent } from '../pages/route/route.component';
import { StopModal } from '../pages/route/stop.modal';
import { RouteMapComponent } from '../pages/route-map/route-map.component';
import { RoutesAndStopsComponent } from '../pages/routes-and-stops/routes-and-stops.component';
import { SettingsComponent } from '../pages/settings/settings.component';
import { StopComponent } from '../pages/stop/stop.component';
import { StopMapComponent } from '../pages/stop-map/stop-map.component';
import { StorageSettingsComponent } from '../pages/storage-settings/storage-settings.component';
import { VehicleComponent } from '../pages/route/vehicle.component';
// Services
import { RouteService }          from '../services/route.service';
import { StopService }          from '../services/stop.service';
import { StopDepartureService }          from '../services/stop-departure.service';
import { VehicleService }          from '../services/vehicle.service';
import { AlertService }          from '../services/alert.service';
import { FavoriteRouteService } from '../services/favorite-route.service';



@NgModule({
  declarations: [
    MyApp,
    AboutComponent,
    ContactComponent,
    MyBusesComponent,
    PlanTripComponent,
    PrivacyPolicyComponent,
    RouteComponent,
    StopModal,
    RouteMapComponent,
    RoutesAndStopsComponent,
    SettingsComponent,
    StopComponent,
    StopMapComponent,
    StorageSettingsComponent,
    VehicleComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutComponent,
    ContactComponent,
    MyBusesComponent,
    PlanTripComponent,
    PrivacyPolicyComponent,
    RouteComponent,
    StopModal,
    RouteMapComponent,
    RoutesAndStopsComponent,
    SettingsComponent,
    StopComponent,
    StopMapComponent,
    StorageSettingsComponent,
    VehicleComponent
  ],
  providers: [ {provide: ErrorHandler, useClass: IonicErrorHandler},
    RouteService, StopService, StopDepartureService, VehicleService, AlertService,
    Storage, FavoriteRouteService]
})
export class AppModule {}
