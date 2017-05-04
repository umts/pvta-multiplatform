import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform, NavController } from 'ionic-angular';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { InfoService } from '../../providers/info.service';
import { AboutComponent } from './about.component';
import {} from 'jasmine';

describe('About Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutComponent],
      imports: [
        IonicModule.forRoot(AboutComponent),
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
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    (<any> window).ga = undefined;
  });

  it ('should be created', () => {
    expect(component instanceof AboutComponent).toBe(true);
  });

  it('sends a pageview to Google Analytics', () => {
    expect((<any>window).ga.calls.allArgs()).toContain(
    ['set', 'page', '/settings/about.html'])
  });
});
