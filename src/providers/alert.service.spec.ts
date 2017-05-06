import { TestBed, inject, async } from '@angular/core/testing';
import { Http, HttpModule, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { MockBackend } from '@angular/http/testing';
import { AlertService } from './alert.service';

describe('Provider: AlertService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        AlertService,
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

  describe('getAlert', () => {
    it('returns a promise that resolves with the JSON object returned by HTTP', inject([AlertService, MockBackend], (alertSvc, mockBackend) => {
      // Just checking that our function returns the data, we don't care
      // about it being a proper Avail object
      const mockResponse = [
        {
          MessageId: 20247,
          Message: "DA ROADS IZ CLOZED.",
          FromDate: "/Date(1473134400000-0400)/",
          Routes: []
        }
      ];
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: mockResponse
        })));
      });
      alertSvc.getAlerts().then(alerts => {
        expect(alerts).toEqual(mockResponse);
      });
    }));
  });
});
