import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Stop } from '../models/stop';

@Injectable()
export class StopService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private stopsURL = 'https://bustracker.pvta.com/InfoPoint/rest/stops/get';  // URL to web api
  constructor(private http: Http) { }

  getAllStops(): Promise<Stop[]> {
    return this.http.get(`${this.stopsURL}allstops`)
      .toPromise()
      .then(response => response.json() as Stop[])
      .catch(this.handleError);
  }

  getStop(id: number): Promise<Stop> {
    const url = `${this.stopsURL}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Stop)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
