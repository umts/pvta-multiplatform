import { async, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from 'ionic-angular';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { MyApp } from '../../app/app.component';
import { IonicStorageModule } from '@ionic/storage';

describe('PrivacyPolicy Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp, PrivacyPolicyComponent],
      imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ],
      providers: [
        NavController
      ]
    });
  }));

  beforeEach(() => {
    (<any> window).ga = jasmine.createSpy('ga');
    fixture = TestBed.createComponent(PrivacyPolicyComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    (<any> window).ga = undefined;

  });

  it ('should be created', () => {
    expect(component instanceof PrivacyPolicyComponent).toBe(true);
  });
  it('sends a pageview to Google Analytics', () => {
    expect((<any>window).ga.calls.allArgs()).toContain(
    ['set', 'page', '/settings/about/privacy-policy.html']);
  });
});
