import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Vehicle } from '../models/vehicle.model';

@Injectable()
export class VehicleService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private vehiclesURL = 'https://bustracker.pvta.com/InfoPoint/rest/vehicles/get';  // URL to web api
  constructor(private http: Http) { }

  getVehicle(id: number): Promise<Vehicle> {
    const url = `${this.vehiclesURL}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Vehicle)
      .catch(this.handleError);
  }

  getRouteVehicles(routeId: number): Promise<Vehicle[]> {
    const url = `${this.vehiclesURL}AllVehiclesForRoute?routeid=${routeId}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Vehicle[])
      .catch(this.handleError);
  }

  private handleError(error: any): void {
    console.error('An error occurred', error); // for demo purposes only
  }
}
