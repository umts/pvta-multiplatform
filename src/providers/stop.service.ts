import { Injectable }    from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';
import { Stop } from '../models/stop.model';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable()
export class StopService {
  private stopsURL = 'https://bustracker.pvta.com/InfoPoint/rest/stops/get';
  private nearestStopURL = 'https://bustracker.pvta.com/InfoPoint/rest/stops/NearestStop';
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

  getNearestStop(lat: number, long: number): Promise<Stop> {
    const url = `${this.nearestStopURL}?latitude=${lat}&longitude=${long}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Stop)
      .catch(this.handleError);
  }

  private handleError(error: any): void {
    console.error('An error occurred', error); // for demo purposes only
  }

  getStopList (): Promise<any> {
    return this.storage.ready().then(() => {
      return this.storage.get('stops').then((stops) => {
        if (stops && stops.list.length > 0) {
          let now = moment();
          let diff = now.diff(stops.time, 'days');
          if (diff <= 1) {
            console.log('stoplist is loaded and recent');
            return new Promise((resolve, reject) => {
              resolve(stops.list);
            });
          } else {
            console.log('stop list is too old!');
            return this.getAllStops();
          }
        } else {
          console.log('got to download stops');
          return this.getAllStops();
        }
      });
    });
  }
  saveStopList(stops: Stop[]): void {
    // console.log('passed', stops);
    this.storage.ready().then(() => {
      this.storage.set('stops', {
        list: stops,
        time: new Date()
      });
    });
  }
  filterStopsByQuery(stops: Stop[], query: string): Stop[] {
    if (!query || query === '') {
      return [];
    }
    query = query.toLowerCase().trim();
    return _.filter(stops, stop => {
      return (stop.Description.toLowerCase().includes(query) ||
      stop.StopId.toString().includes(query));
    });
  }
}
