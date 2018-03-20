import { async, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { MyApp } from '../../app/app.component';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { RouteService } from '../../providers/route.service';
import { StopService } from '../../providers/stop.service';
import { StopDepartureService } from '../../providers/stop-departure.service';
import { InfoService } from '../../providers/info.service';
import { AutoRefreshService } from '../../providers/auto-refresh.service';
import { DepartureSortService } from '../../providers/departure-sort.service';
import { FavoriteStopService } from '../../providers/favorite-stop.service';
import { ConnectivityService } from '../../providers/connectivity.service';
import { ToastService } from '../../providers/toast.service';
import { AlertService } from '../../providers/alert.service';
import { Alert } from '../../models/alert.model';
import { StopComponent } from './stop.component';
import { NavParamsMock } from '../../../test-config/mocks-ionic';

describe('Stop Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp, StopComponent],
      imports: [
        IonicModule.forRoot(MyApp),
        HttpModule,
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ],
      providers: [
        NavController,
        { provide: NavParams, useClass: NavParamsMock },
        StopDepartureService,
        InfoService,
        RouteService,
        LoadingController,
        FavoriteStopService,
        StopService,
        ConnectivityService,
        AutoRefreshService,
        AlertController,
        ToastService,
        AlertService,
        DepartureSortService
      ]
    });
  }));

  beforeEach(() => {
    (<any> window).ga = jasmine.createSpy('ga');
    fixture = TestBed.createComponent(StopComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    (<any> window).ga = undefined;

  });

  it ('should be created', () => {
    expect(component instanceof StopComponent).toBe(true);
  });
  it('sends a pageview to Google Analytics', () => {
    expect((<any>window).ga.calls.allArgs()).toContain(
    ['set', 'page', '/stop.html']);
  });
});
