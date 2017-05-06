import { TestBed, inject, async } from '@angular/core/testing';
import { Http, HttpModule, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { MockBackend } from '@angular/http/testing';
import { StopService } from './stop.service';

describe('Provider: StopService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        StopService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      imports: [
        HttpModule,
        IonicStorageModule.forRoot({name: 'test', storeName: 'test'})
      ]
    }).compileComponents();
  }));

  beforeEach(() => {});

  describe('getStop', () => {
    it('returns a promise that resolves with the JSON object returned by HTTP', inject([StopService, MockBackend], (stopSvc, mockBackend) => {
      // Just checking that our function returns the data, we don't care
      // about it being a proper Avail object
      const mockResponse = {
        StopId: 56,
        Description:"Arnold House"
      };
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: mockResponse
        })));
      });
      stopSvc.getStop(56).then(stop => {
        expect(stop).toEqual(mockResponse);
      })
    }));
  });
  describe('getAllStops', () => {
    it('returns a promise that resolves with the JSON object returned by HTTP', inject([StopService, MockBackend], (stopSvc, mockBackend) => {
      // Just checking that our function returns the data, we don't care
      // about it being a proper Avail object
      const mockResponse = [
        { StopId: 1 }, { StopId: 2 },
        { StopId: 3 }, { StopId: 4 }
      ];
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: mockResponse
        })));
      });
      stopSvc.getAllStops().then(stops => {
        expect(stops).toEqual(mockResponse);
        expect(Array.isArray(stops)).toBeTruthy();
      })
    }));
  })
});
