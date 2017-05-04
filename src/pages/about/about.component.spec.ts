import { async, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from 'ionic-angular';
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
        IonicModule.forRoot(AboutComponent)
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
});
