import { async, TestBed } from '@angular/core/testing';
import { MyApp } from '../../app/app.component';
import {} from 'jasmine';
import { Ng2PaginationModule } from 'ng2-pagination';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, NavController, LoadingController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { RouteService } from '../../providers/route.service';
import { StopService } from '../../providers/stop.service';
import { InfoService } from '../../providers/info.service';
import { FavoriteRouteService } from '../../providers/favorite-route.service';
import { RoutesAndStopsComponent } from './routes-and-stops.component';
import { FavoriteStopService } from '../../providers/favorite-stop.service';

describe('RoutesAndStops Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp, RoutesAndStopsComponent],
      imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'}),
        Ng2PaginationModule
      ],
      providers: [
        NavController,
        InfoService,
        RouteService,
        StopService,
        LoadingController,
        FavoriteRouteService,
        AlertController,
        FavoriteStopService,
        Geolocation
      ]
    })
  }));

  beforeEach(() => {
    (<any> window).ga = jasmine.createSpy('ga');
    fixture = TestBed.createComponent(RoutesAndStopsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    (<any> window).ga = undefined;

  });

  it ('should be created', () => {
    expect(component instanceof RoutesAndStopsComponent).toBe(true);
  });
  it('sends a pageview to Google Analytics', () => {
    expect((<any>window).ga.calls.allArgs()).toContain(
    ['set', 'page', '/routes-and-stops.html'])
  });
});
