import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform, NavController, ModalController, AlertController } from 'ionic-angular';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { AlertService } from '../../providers/alert.service';
import { RouteService } from '../../providers/route.service';
import { StopService } from '../../providers/stop.service';
import { FavoriteTripService } from '../../providers/favorite-trip.service';
import { gaInit } from '../../app/ga';
import { MyBusesComponent } from './my-buses.component';
import { PlatformMock } from '../../../test-config/mocks-ionic';
import {} from 'jasmine';

describe('MyBuses Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyBusesComponent],
      imports: [
        IonicModule.forRoot(MyBusesComponent),
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ],
      providers: [
        NavController,
        AlertService,
        AlertController,
        ModalController,
        RouteService,
        StopService,
        FavoriteTripService,
        { provide: Platform, useClass: PlatformMock }
      ]
    })
  }));

  beforeEach(() => {
    (<any> window).ga = jasmine.createSpy('ga');
    fixture = TestBed.createComponent(MyBusesComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    (<any> window).ga = undefined;
  });

  it ('should be created', () => {
    expect(component instanceof MyBusesComponent).toBe(true);
  });

  it('sends a pageview to Google Analytics', () => {
    expect((<any>window).ga.calls.allArgs()).toContain(
    ['set', 'page', '/my-buses.html'])
  });
  describe('ionViewWillEnter', () => {
    it('should call getFavoriteStops', () => {
      spyOn(component, 'getFavoriteStops');
      component.ionViewWillEnter();
      expect(component.getFavoriteStops).toHaveBeenCalled();

    });
    it('should call getFavoriteRoutes', () => {
      spyOn(component, 'getFavoriteRoutes');
      component.ionViewWillEnter();
      expect(component.getFavoriteRoutes).toHaveBeenCalled();

    });
    it('should call getSavedTrips', () => {
      spyOn(component, 'getSavedTrips');
      component.ionViewWillEnter();
      expect(component.getSavedTrips).toHaveBeenCalled();

    });
  })
});
