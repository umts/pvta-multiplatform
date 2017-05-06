import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform, NavParams, NavController, ModalController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { RouteService } from '../../providers/route.service';
import { StopService } from '../../providers/stop.service';
import { FavoriteTripService } from '../../providers/favorite-trip.service';
import { MyApp } from '../../app/app.component';
import { PlanTripComponent } from './plan-trip.component';
import { InfoService } from '../../providers/info.service';
import { MapService } from '../../providers/map.service';
import { PlatformMock, NavParamsMock } from '../../../test-config/mocks-ionic';
import { Geolocation } from '@ionic-native/geolocation';

describe('PlanTrip Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp, PlanTripComponent],
      imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ],
      providers: [
        NavController,
        { provide: NavParams, useClass: NavParamsMock },
        LoadingController,
        AlertController,
        ToastController,
        ModalController,
        RouteService,
        StopService,
        FavoriteTripService,
        Geolocation,
        InfoService,
        MapService,
        { provide: Platform, useClass: PlatformMock }
      ]
    });
  }));

  beforeEach(() => {
    (<any> window).ga = jasmine.createSpy('ga');
    fixture = TestBed.createComponent(PlanTripComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    (<any> window).ga = undefined;
  });

  it ('should be created', () => {
    expect(component instanceof PlanTripComponent).toBe(true);
  });

  it('sends a pageview to Google Analytics', () => {
    expect((<any>window).ga.calls.allArgs()).toEqual(
    [["set","page","/plan-trip.html"],["send","pageview"]]);
  });
});
