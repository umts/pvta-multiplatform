import { async, TestBed } from '@angular/core/testing';
import { MyApp } from '../../app/app.component';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, NavController, NavParams } from 'ionic-angular';
import { RouteService } from '../../providers/route.service';
import { VehicleService } from '../../providers/vehicle.service';
import { MapService } from '../../providers/map.service';
import { AutoRefreshService } from '../../providers/auto-refresh.service';
import { ConnectivityService } from '../../providers/connectivity.service';
import { RouteMapComponent } from './route-map.component';
import { NavParamsMock } from '../../../test-config/mocks-ionic';

describe('RouteMap Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp, RouteMapComponent],
      imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ],
      providers: [
        NavController,
        { provide: NavParams, useClass: NavParamsMock },
        RouteService,
        VehicleService,
        MapService,
        ConnectivityService,
        AutoRefreshService
      ]
    });
  }));

  beforeEach(() => {
    (<any> window).ga = jasmine.createSpy('ga');
    fixture = TestBed.createComponent(RouteMapComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    (<any> window).ga = undefined;

  });

  it ('should be created', () => {
    expect(component instanceof RouteMapComponent).toBe(true);
  });
  it('sends a pageview to Google Analytics', () => {
    expect((<any>window).ga.calls.allArgs()).toContain(
    ['set', 'page', '/route/route-map.html']);
  });
});
