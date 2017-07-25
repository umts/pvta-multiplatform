import { async, TestBed } from '@angular/core/testing';
import { IonicModule, NavController, ModalController, AlertController } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { AlertService } from '../../providers/alert.service';
import { MyApp } from '../../app/app.component';
import { FavoriteTripService } from '../../providers/favorite-trip.service';
import { FavoriteStopService } from '../../providers/favorite-stop.service';
import { FavoriteRouteService } from '../../providers/favorite-route.service';
import { FavoritesComponent } from './favorites.component';

describe('Favorites Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp, FavoritesComponent],
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
        FavoriteRouteService,
        FavoriteStopService
      ]
    });
  }));

  beforeEach(() => {
    (<any> window).ga = jasmine.createSpy('ga');
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    (<any> window).ga = undefined;
  });

  it ('should be created', () => {
    expect(component instanceof FavoritesComponent).toBe(true);
  });

  it('sends a pageview to Google Analytics', () => {
    expect((<any>window).ga.calls.allArgs()).toContain(
    ['set', 'page', '/favorites.html']);
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
  describe('removeRoute', () => {
    // Make an arbitrary route object available to each test
    beforeAll(() => {
      this.route = {
        RouteId: 20035,
        GoogleDescription: 'Campus Shuttle Southbound',
        ShortName: '35',
        RouteAbbreviation: '35',
        Color: '00467E'
      }
    });
    it('removes an item from the routes array', () => {
      // Set the class-wide this.routes array in the component
      component.routes = [ this.route ];
      expect(component.routes.length).toEqual(1);
      // Call the function we're testing
      component.removeRoute(this.route);
      expect(component.routes.length).toEqual(0);
    });
    it('calls the FavoriteRouteService\'s remove() function', () => {
      // Obtain a reference to a the service
      // https://stackoverflow.com/questions/35733846/how-to-spy-a-service-call-in-angular2
      let mockFavRouteSvc = fixture.debugElement.injector.get(FavoriteRouteService);
      // Set the class-wide variable again (component isn't available in beforeAll?)
      component.routes = [ this.route ];
      // Insert ourselves into the FavoriteRouteService and
      // listen specifically for stuff related to remove()
      spyOn(mockFavRouteSvc, 'remove');
      // Call our function
      component.removeRoute(this.route);
      expect(mockFavRouteSvc.remove).toHaveBeenCalledWith(this.route);
    });
  });
});
