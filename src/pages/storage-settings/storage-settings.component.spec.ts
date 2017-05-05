import { async, TestBed } from '@angular/core/testing';
import { IonicModule, NavController, ToastController, AlertController } from 'ionic-angular';
import { StorageSettingsComponent } from './storage-settings.component';
import { MyApp } from '../../app/app.component';
import { IonicStorageModule } from '@ionic/storage';

describe('StorageSettings Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp, StorageSettingsComponent],
      imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ],
      providers: [
        NavController,
        ToastController,
        AlertController
      ]
    });
  }));

  beforeEach(() => {
    (<any> window).ga = jasmine.createSpy('ga');
    fixture = TestBed.createComponent(StorageSettingsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    (<any> window).ga = undefined;

  });

  it ('should be created', () => {
    expect(component instanceof StorageSettingsComponent).toBe(true);
  });
  it('sends a pageview to Google Analytics', () => {
    expect((<any>window).ga.calls.allArgs()).toContain(
    ['set', 'page', '/settings/storage-settings.html']);
  });
});
