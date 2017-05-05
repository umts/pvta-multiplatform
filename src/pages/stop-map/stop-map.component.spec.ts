import { async, TestBed } from '@angular/core/testing';
import { MyApp } from '../../app/app.component';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { StopService } from '../../providers/stop.service';
import { MapService } from '../../providers/map.service';
import { ConnectivityService } from '../../providers/connectivity.service';
import { StopMapComponent } from './stop-map.component';
import { Geolocation } from '@ionic-native/geolocation';
import { NavParamsMock } from '../../../test-config/mocks-ionic';

describe('StopMap Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp, StopMapComponent],
      imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ],
      providers: [
        { provide: NavParams, useClass: NavParamsMock },
        StopService,
        MapService,
        ToastController,
        ConnectivityService,
        LoadingController,
        Geolocation
      ]
    });
  }));

  beforeEach(() => {
    (<any> window).ga = jasmine.createSpy('ga');
    fixture = TestBed.createComponent(StopMapComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    (<any> window).ga = undefined;

  });

  it ('should be created', () => {
    expect(component instanceof StopMapComponent).toBe(true);
  });
  it('sends a pageview to Google Analytics', () => {
    expect((<any>window).ga.calls.allArgs()).toContain(
    ['set', 'page', '/stop/stop-map.html']);
  });
});
