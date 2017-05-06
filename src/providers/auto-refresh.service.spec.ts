import { TestBed, inject, async } from '@angular/core/testing';
import { Http, HttpModule, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { MockBackend } from '@angular/http/testing';
import { AutoRefreshService } from './auto-refresh.service';

describe('Provider: AutoRefreshService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        AutoRefreshService,
      ],
      imports: [
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ]
    }).compileComponents();
  }));

  beforeEach(() => {});

  describe('isAutoRefreshEnabled', () => {
    it('returns false for values less than 0', inject([AutoRefreshService], (autoRefreshSvc) => {
      expect(autoRefreshSvc.isAutoRefreshEnabled(-1)).toEqual(false);
      expect(autoRefreshSvc.isAutoRefreshEnabled(-100)).toEqual(false);
      expect(autoRefreshSvc.isAutoRefreshEnabled(-981234)).toEqual(false);
    }));
    it('returns true for values 0 or greater', inject([AutoRefreshService], (autoRefreshSvc) => {
      expect(autoRefreshSvc.isAutoRefreshEnabled(0)).toEqual(true);
      expect(autoRefreshSvc.isAutoRefreshEnabled(1)).toEqual(true);
      expect(autoRefreshSvc.isAutoRefreshEnabled(3000)).toEqual(true);
    }));
  });
  describe('verifyValidity', () => {
    it('return a two element array', inject([AutoRefreshService], (autoRefreshSvc) => {
      let validValue = autoRefreshSvc.verifyValidity(2);
      expect(Array.isArray(validValue)).toEqual(true);
      expect(validValue.length).toEqual(2);
      let invalidValue = autoRefreshSvc.verifyValidity(null);
      expect(Array.isArray(invalidValue)).toEqual(true);
      expect(invalidValue.length).toEqual(2);
    }));
    it('saves a valid number when the parameter is null', inject([AutoRefreshService], (autoRefreshSvc) => {
      autoRefreshSvc.storage.set = jasmine.createSpy('storage.set');
      autoRefreshSvc.verifyValidity(null);
      expect(autoRefreshSvc.storage.set).toHaveBeenCalled();
    }));
  });
});
