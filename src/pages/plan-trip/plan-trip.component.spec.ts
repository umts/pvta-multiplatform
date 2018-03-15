import { async, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { IonicModule, Platform, NavParams, NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { RouteService } from '../../providers/route.service';
import { ToastService } from '../../providers/toast.service'
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
        HttpModule,
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ],
      providers: [
        NavController,
        { provide: NavParams, useClass: NavParamsMock },
        LoadingController,
        AlertController,
        ToastService,
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
    expect((<any>window).ga.calls.allArgs()).toContain(
    ['set', 'page', '/plan-trip.html']);
  });
});
