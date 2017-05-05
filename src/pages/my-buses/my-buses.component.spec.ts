import { async, TestBed } from '@angular/core/testing';
import { IonicModule, NavController, ModalController, AlertController } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { AlertService } from '../../providers/alert.service';
import { MyApp } from '../../app/app.component';
import { FavoriteTripService } from '../../providers/favorite-trip.service';
import { MyBusesComponent } from './my-buses.component';
import {} from 'jasmine';

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
        AlertService,
        AlertController,
        ModalController,
        FavoriteTripService,
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
