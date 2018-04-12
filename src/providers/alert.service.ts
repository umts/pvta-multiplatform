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
    let errorMessage = `${error.name} error occurred`;
    console.error(errorMessage, error); // for demo purposes only
  }
}
