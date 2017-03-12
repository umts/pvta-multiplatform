import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Alert } from '../models/alert.model';

@Injectable()
export class AlertService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private alertsURL = 'https://bustracker.pvta.com/InfoPoint/rest/PublicMessages/GetCurrentMessages';  // URL to web api
  constructor(private http: Http) { }

  getAlerts(): Promise<Alert[]> {
    return this.http.get(this.alertsURL)
      .toPromise()
      .then(response => response.json() as Alert[])
      .catch(this.handleError);
  }

  private handleError(error: any): void {
    console.error('An error occurred', error); // for demo purposes only
    // return Promise.reject(error.message || error);
  }
}
