import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';
import { Stop } from '../models/stop.model';
import * as moment from 'moment';

@Injectable()
export class StopService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private stopsURL = 'https://bustracker.pvta.com/InfoPoint/rest/stops/get';  // URL to web api
  constructor(private http: Http, private storage: Storage) { }

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

  getStopList (cb: Function): any {
    this.storage.ready().then(() => {
      this.storage.get('stops').then((stops) => {
        if (stops && stops.list.length > 0) {
          let now = moment();
          let diff = now.diff(stops.time, 'days')
          if (diff <= 1) {
            console.log('stoplist is loaded and recent')
            cb(new Promise((resolve, reject) => {
              resolve(stops.list);
            }))
          } else {
            console.log('stop list is too old!')
            cb(this.getAllStops());
          }
        }
        else {
          console.log('got to download stops')
          cb(this.getAllStops());
        }
      })
    });
  }
  saveStopList(stops: Stop[]): void {
    console.log('passed', stops);
    this.storage.ready().then(() => {
      this.storage.set('stops', {
        list: stops,
        time: new Date()
      });
      this.storage.get('stops').then((stops) => {
        console.log('loaded', stops);
      })
    })
  }
}
