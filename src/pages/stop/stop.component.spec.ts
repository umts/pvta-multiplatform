import { async, TestBed } from '@angular/core/testing';
import { MyApp } from '../../app/app.component';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { RouteService } from '../../providers/route.service';
import { StopService } from '../../providers/stop.service';
import { StopDepartureService } from '../../providers/stop-departure.service';
import { InfoService } from '../../providers/info.service';
import { AutoRefreshService } from '../../providers/auto-refresh.service';
import { FavoriteStopService } from '../../providers/favorite-stop.service';
import { ConnectivityService } from '../../providers/connectivity.service';
import { StopComponent } from './stop.component';
import { NavParamsMock, StopDepartureServiceMock } from '../../../test-config/mocks-ionic';

describe('Stop Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp, StopComponent],
      imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ],
      providers: [
        NavController,
        { provide: NavParams, useClass: NavParamsMock },
        { provide: StopDepartureService, useClass: StopDepartureServiceMock },
        InfoService,
        RouteService,
        LoadingController,
        FavoriteStopService,
        StopService,
        ConnectivityService,
        AutoRefreshService,
        AlertController
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
    expect((<any>window).ga.calls.allArgs()).toEqual(
    [["set","page","/stop.html"],["send","pageview"]]);
  });
  describe('getDepartures', () => {
    it('gets stop departures', () => {
      let departureService = fixture.debugElement.injector.get(StopDepartureService);
      spyOn(departureService, 'getStopDeparture');
      component.getDepartures();
      expect(departureService.getStopDepartures).toHaveBeenCalled();
    });
  });
  describe('sort', () => {

  })
});
