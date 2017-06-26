// Angular, Ionic, and their related components
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Ng2PaginationModule } from 'ng2-pagination';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';

// Pages
import { AboutComponent } from '../pages/about/about.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { FavoritesComponent } from '../pages/favorites/favorites.component';
import { PlanTripComponent } from '../pages/plan-trip/plan-trip.component';
import { PrivacyPolicyComponent } from '../pages/privacy-policy/privacy-policy.component';
import { RouteComponent } from '../pages/route/route.component';
import { StopModal } from '../modals/stop-modal/stop.modal';
import { RouteModal } from '../modals/route-modal/route.modal';
import { RouteMapComponent } from '../pages/route-map/route-map.component';
import { RoutesAndStopsComponent } from '../pages/routes-and-stops/routes-and-stops.component';
import { SettingsComponent } from '../pages/settings/settings.component';
import { StopComponent } from '../pages/stop/stop.component';
import { StopMapComponent } from '../pages/stop-map/stop-map.component';
import { StorageSettingsComponent } from '../pages/storage-settings/storage-settings.component';
import { VehicleComponent } from '../pages/route/vehicle.component';
// Services
import { RouteService }          from '../providers/route.service';
import { StopService }          from '../providers/stop.service';
import { StopDepartureService }          from '../providers/stop-departure.service';
import { VehicleService }          from '../providers/vehicle.service';
import { AlertService }          from '../providers/alert.service';
import { FavoriteRouteService } from '../providers/favorite-route.service';
import { FavoriteStopService } from '../providers/favorite-stop.service';
import { FavoriteTripService } from '../providers/favorite-trip.service';
import { ConnectivityService } from '../providers/connectivity.service';
import { MapService } from '../providers/map.service';
import { InfoService } from '../providers/info.service';
import { AutoRefreshService } from '../providers/auto-refresh.service';



@NgModule({
  declarations: [
    MyApp,
    AboutComponent,
    ContactComponent,
    FavoritesComponent,
    PlanTripComponent,
    PrivacyPolicyComponent,
    RouteComponent,
    RouteModal,
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
    IonicModule.forRoot(MyApp, {}, {
      links: [
        {component: FavoritesComponent, name: 'Favorites', segment: 'favorites'},
        {component: RoutesAndStopsComponent, name: 'Routes and Stops', segment: 'routes-and-stops'},
        {component: PlanTripComponent, name: 'Plan Trip', segment: 'plan-trip'},
        {component: SettingsComponent, name: 'Settings', segment: 'settings'},
        {component: AboutComponent, name: 'About', segment: 'settings/about', defaultHistory: [SettingsComponent]},
        {component: StorageSettingsComponent, name: 'Storage', segment: 'settings/storage', defaultHistory: [SettingsComponent]},
        {component: ContactComponent, name: 'Contact', segment: 'settings/contact', defaultHistory: [SettingsComponent]},
        {component: PrivacyPolicyComponent, name: 'Privacy Policy', segment: 'settings/about/privacy-policy', defaultHistory: [AboutComponent, SettingsComponent]},
        {component: RouteComponent, name: 'Route', segment: 'route/:routeId', defaultHistory: [FavoritesComponent]},
        {component: StopComponent, name: 'Stop', segment: 'stop/:stopId', defaultHistory: [FavoritesComponent]},
        {component: RouteMapComponent, name: 'Route Map', segment: 'route/:routeId/map', defaultHistory: [FavoritesComponent]},
        {component: StopMapComponent, name: 'Stop Map', segment: 'stop/:stopId/map', defaultHistory: [FavoritesComponent]},
      ]
    }),
    // For backwards compatibility with V1 users' storage!
    IonicStorageModule.forRoot({name: 'localforage', storeName: 'keyvaluepairs'}),
    HttpModule,
    Ng2PaginationModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutComponent,
    ContactComponent,
    FavoritesComponent,
    PlanTripComponent,
    PrivacyPolicyComponent,
    RouteComponent,
    RouteModal,
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
    FavoriteRouteService, FavoriteStopService, ConnectivityService,
    MapService, InfoService, FavoriteTripService, AutoRefreshService,
    StatusBar, SplashScreen, Geolocation]
})
export class AppModule {}
