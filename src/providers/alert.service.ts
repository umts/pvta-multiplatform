import { Injectable }    from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Alert } from '../models/alert.model';

@Injectable()
export class AlertService {
  private alertsURL = 'https://bustracker.pvta.com/InfoPoint/rest/PublicMessages/GetCurrentMessages';  // URL to web api
  constructor(private http: Http) { }

  getAlerts(): Promise<Alert[]> {
    return this.http.get(this.alertsURL)
      .toPromise()
      .then(response => response.json() as Alert[])
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
