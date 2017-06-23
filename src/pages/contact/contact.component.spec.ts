import { async, TestBed } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { ContactComponent } from './contact.component';
import { MyApp } from '../../app/app.component';
import { IonicStorageModule } from '@ionic/storage';

describe('Contact Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp, ContactComponent],
      imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ],
      providers: [
      ]
    });
  }));

  beforeEach(() => {
    (<any> window).ga = jasmine.createSpy('ga');
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    (<any> window).ga = undefined;

  });

  it ('should be created', () => {
    expect(component instanceof ContactComponent).toBe(true);
  });
  it('sends a pageview to Google Analytics', () => {
    expect((<any>window).ga.calls.allArgs()).toContain(
    ['set', 'page', '/settings/contact.html']);
  });
});
