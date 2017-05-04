import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform, NavController, ModalController, AlertController } from 'ionic-angular';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { AlertService } from '../../providers/alert.service';
import { RouteService } from '../../providers/route.service';
import { StopService } from '../../providers/stop.service';
import { FavoriteTripService } from '../../providers/favorite-trip.service';
import { gaInit } from '../../app/ga';
import { MyBusesComponent } from './my-buses.component';
import { PlatformMock, ga } from '../../../test-config/mocks-ionic';

describe('MyBuses Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyBusesComponent],
      imports: [
        IonicModule.forRoot(MyBusesComponent),
        ga,
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
    fixture = TestBed.createComponent(MyBusesComponent);
    component = fixture.componentInstance;
    component.ga = function(){};
  });

  it ('should be created', () => {
    expect(component instanceof MyBusesComponent).toBe(true);
  });

});
