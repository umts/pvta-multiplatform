import { TestBed, inject, async } from '@angular/core/testing';
import { Http, HttpModule, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { ToastController, IonicModule } from 'ionic-angular';
import { MockBackend } from '@angular/http/testing';
import { MyApp } from '../app/app.component';
import { InfoService } from './info.service';

describe('Provider: InfoService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp],
      providers: [
        InfoService,
        ToastController
      ],
      imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ]
    }).compileComponents();
  }));

  beforeEach(() => {});
  describe('getVersionNumber', () => {
    it('should return a string', inject([InfoService], (infoSvc) => {
      let result = infoSvc.getVersionNumber();
      expect(typeof result).toBe('string');
    }));
  });
  describe('isIE', () => {
    it('should return false when browser is not IE', inject([InfoService], (infoSvc) => {
      infoSvc.setInternetExplorer(false);
      expect(infoSvc.isInternetExplorer()).toBe(false);
    }));
  });
  describe('setInternetExplorer', () => {
    describe('NOT using IE', () => {
      it('Should do nothing', inject([InfoService], (infoSvc) => {
        infoSvc.toast.create = jasmine.createSpy('toast.create');
        infoSvc.setInternetExplorer(false);
        expect(infoSvc.toast.create).not.toHaveBeenCalled();

      }));
    });
    describe('Using IE', () => {
      it('should return false when browser is not IE', inject([InfoService, ToastController], (infoSvc, toastCtrl) => {
        infoSvc.toast.create = jasmine.createSpy('toast.create');
        infoSvc.setInternetExplorer(true);
        // expect(infoSvc.toast.create).toHaveBeenCalled();
      }));
    });
  });
});
