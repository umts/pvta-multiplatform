import { async, TestBed } from '@angular/core/testing';
import { MyApp } from '../../app/app.component';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { RouteService } from '../../providers/route.service';
import { VehicleService } from '../../providers/vehicle.service';
import { AlertService } from '../../providers/alert.service';
import { FavoriteRouteService } from '../../providers/favorite-route.service';
import { ConnectivityService } from '../../providers/connectivity.service';
import { RouteComponent } from './route.component';
import { NavParamsMock } from '../../../test-config/mocks-ionic';

describe('Route Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp, RouteComponent],
      imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ],
      providers: [
        NavController,
        { provide: NavParams, useClass: NavParamsMock },
        RouteService,
        VehicleService,
        AlertService,
        ConnectivityService,
        ModalController,
        FavoriteRouteService,
        AlertController
      ]
    });
  }));

  beforeEach(() => {
    (<any> window).ga = jasmine.createSpy('ga');
    fixture = TestBed.createComponent(RouteComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    (<any> window).ga = undefined;

  });

  it ('should be created', () => {
    expect(component instanceof RouteComponent).toBe(true);
  });
  it('sends a pageview to Google Analytics', () => {
    expect((<any>window).ga.calls.allArgs()).toContain(
    ['set', 'page', '/route.html']);
  });
});
