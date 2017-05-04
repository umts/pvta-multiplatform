import { async, TestBed } from '@angular/core/testing';
import { IonicModule, NavController, Platform } from 'ionic-angular';
import { InfoService } from '../../providers/info.service';
import { SettingsComponent } from './settings.component';
import { MyApp } from '../../app/app.component';
import {} from 'jasmine';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConnectivityService } from '../../providers/connectivity.service';
import { PlatformMock } from '../../../test-config/mocks-ionic';

describe('Settings Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp, SettingsComponent],
      imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ],
      providers: [
        NavController,
        InfoService
      ]
    })
  }));

  beforeEach(() => {
    (<any> window).ga = jasmine.createSpy('ga');
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    (<any> window).ga = undefined;

  });

  it ('should be created', () => {
    expect(component instanceof SettingsComponent).toBe(true);
  });
  it('sends a pageview to Google Analytics', () => {
    expect((<any>window).ga.calls.allArgs()).toContain(
    ['set', 'page', '/settings.html'])
  });
});
