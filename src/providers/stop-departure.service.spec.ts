import { TestBed, inject, async } from '@angular/core/testing';
import { Http, HttpModule, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { MockBackend } from '@angular/http/testing';
import { StopDepartureService } from './stop-departure.service';

describe('Provider: StopDepartureService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        StopDepartureService,
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

  describe('getStopDeparture', () => {
    it('returns a promise that resolves with the JSON object returned by HTTP', inject([StopDepartureService, MockBackend], (stopDepartureSvc, mockBackend) => {
      // Just checking that our function returns the data, we don't care
      // about it being a proper Avail object
      const mockResponse = [
        {
          "StopId": 56,
          "RouteDirections": [
            {
              "RouteId": 20030,
              "Departures": []
            }
          ]
        }
      ];
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: mockResponse
        })));
      });
      stopDepartureSvc.getStopDeparture(56).then(stopDeparture => {
        expect(stopDeparture).toEqual(mockResponse);
      });
    }));
  });
});
