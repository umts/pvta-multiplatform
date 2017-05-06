import { TestBed, inject, async } from '@angular/core/testing';
import { Http, HttpModule, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { MockBackend } from '@angular/http/testing';
import { RouteService } from './route.service';

describe('Provider: RouteService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        RouteService,
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

  describe('getRoute', () => {
    it('returns a promise that resolves with the JSON object returned by HTTP', inject([RouteService, MockBackend], (routeSvc, mockBackend) => {
      // Just checking that our function returns the data, we don't care
      // about it being a proper Avail object
      const mockResponse = {
        RouteId: 20030,
        RouteAbbreviation:"30",
        IvrDescription:"North Amherst Old Belchertown Rd",
        Color:"C7A020",
      };
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: mockResponse
        })));
      });
      routeSvc.getRoute(20030).then(route => {
        expect(route).toEqual(mockResponse);
      })
    }));
  });
  describe('getAllRoutes', () => {
    it('returns a promise that resolves with the JSON object returned by HTTP', inject([RouteService, MockBackend], (routeSvc, mockBackend) => {
      // Just checking that our function returns the data, we don't care
      // about it being a proper Avail object
      const mockResponse = [
        { RouteId: 20030 }, { RouteId: 20031 },
        { RouteId: 20033 }, { RouteId: 20034 }
      ];
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: mockResponse
        })));
      });
      routeSvc.getAllRoutes().then(routes => {
        expect(routes).toEqual(mockResponse);
        expect(Array.isArray(routes)).toBeTruthy();
      })
    }));
  })
});
