import { TestBed, inject, async } from '@angular/core/testing';
import { Http, HttpModule, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { MockBackend } from '@angular/http/testing';
import { VehicleService } from './vehicle.service';

describe('Provider: VehicleService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        VehicleService,
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

  describe('getVehicle', () => {
    it('returns a promise that resolves with the JSON object returned by HTTP', inject([VehicleService, MockBackend], (vehicleSvc, mockBackend) => {
      // Just checking that our function returns the data, we don't care
      // about it being a proper Avail object
      const mockResponse = {
        VehicleId: 119,
        Name:"3228"
      };
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: mockResponse
        })));
      });
      vehicleSvc.getVehicle(119).then(vehicle => {
        expect(vehicle).toEqual(mockResponse);
      })
    }));
  });
  describe('getRouteVehicles', () => {
    it('returns a promise that resolves with the JSON object returned by HTTP', inject([VehicleService, MockBackend], (vehicleSvc, mockBackend) => {
      // Just checking that our function returns the data, we don't care
      // about it being a proper Avail object
      const mockResponse = [
        {
          VehicleId: 115,
          Name: "3401",
          RouteId: 20030
        }
      ];
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: mockResponse
        })));
      });
      vehicleSvc.getRouteVehicles(20030).then(vehicles => {
        expect(vehicles).toEqual(mockResponse);
        expect(Array.isArray(vehicles)).toBeTruthy();
      })
    }));
  })
});
