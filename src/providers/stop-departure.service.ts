import { Injectable }    from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { StopDeparture } from '../models/stop-departure.model';

@Injectable()
export class StopDepartureService {
  private stopDeparturesURL = 'https://bustracker.pvta.com/InfoPoint/rest/stopdepartures/get';  // URL to web api
  constructor(private http: Http) { }

  getStopDeparture(id: number): Promise<StopDeparture[]> {
    const url = `${this.stopDeparturesURL}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as StopDeparture[])
      .timeout(10000)
      .catch(this.handleError);
  }

  private handleError(error: any): void {
    if (error.name === "TimeoutError") {
      console.error('A timeout error occurred', error);
    } else {
      console.error('An error occurred', error); // for demo purposes only
    }
  }
}
