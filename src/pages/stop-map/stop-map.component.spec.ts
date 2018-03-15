import { async, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { MyApp } from '../../app/app.component';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, NavParams, LoadingController } from 'ionic-angular';
import { StopService } from '../../providers/stop.service';
import { MapService } from '../../providers/map.service';
import { ConnectivityService } from '../../providers/connectivity.service';
import { ToastService } from '../../providers/toast.service';
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
        HttpModule,
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ],
      providers: [
        { provide: NavParams, useClass: NavParamsMock },
        StopService,
        MapService,
        ToastService,
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
