import { async, TestBed } from '@angular/core/testing';
import { IonicModule, NavController, ModalController, AlertController } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { AlertServiceMock } from '../../../test-config/mocks-ionic';
import { AlertService } from '../../providers/alert.service';
import { MyApp } from '../../app/app.component';
import { FavoriteTripService } from '../../providers/favorite-trip.service';
import { MyBusesComponent } from './my-buses.component';

describe('MyBuses Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp, MyBusesComponent],
      imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ],
      providers: [
        NavController,
        { provide: AlertService, useClass: AlertServiceMock },
        AlertController,
        ModalController,
        FavoriteTripService,
      ]
    });
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
    expect((<any>window).ga.calls.allArgs()).toEqual(
    [["set","page","/my-buses.html"],["send","pageview"]]);
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
  });
  describe('filterAlerts', () => {
    beforeEach(() => {
      component.routes = [{RouteId: 20038}, {RouteId: 20035}];
    });
    it('begins with an empty alerts array', () => {
      expect(component.alerts).toBeTruthy();
      expect(Array.isArray(component.alerts)).toEqual(true);
      expect(component.alerts.length).toEqual(0);
    });
    it('adds alerts with no specific route to the array', () => {
      component.filterAlerts();
      // expect(component.alerts.length).toBeGreaterThan(0);
      // expect(component.alerts).toContain({
      //   MessageId: 0,
      //   Message: "All routes",
      //   Routes: []
      // });
      expect(false).toEqual(true);
    });
    it('keeps alerts whose routes are in the favorites', () => {
      expect(false).toEqual(true);
    })
  });
});
