import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { StopDeparture } from '../models/stop-departure.model';

@Injectable()
export class StopDepartureService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private stopDeparturesURL = 'https://bustracker.pvta.com/InfoPoint/rest/stopdepartures/get';  // URL to web api
  constructor(private http: Http) { }

  getStopDeparture(id: number): Promise<StopDeparture[]> {
    const url = `${this.stopDeparturesURL}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as StopDeparture[])
      .catch(this.handleError);
  }

  private handleError(error: any): void {
    console.error('An error occurred', error); // for demo purposes only
  }
}
