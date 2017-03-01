import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';
import { Route } from '../models/route.model';
import { RouteDetail } from '../models/route-detail.model';
import * as moment from 'moment';


@Injectable()
export class RouteService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private routesURL = 'https://bustracker.pvta.com/InfoPoint/rest/routes/get';  // URL to web api
  private routeDetailsURL = 'https://bustracker.pvta.com/InfoPoint/rest/routedetails/get';  // URL to web api
  constructor(private http: Http, private storage: Storage) { }

  getAllRoutes(): Promise<Route[]> {
    console.log('get all routes');
    return this.http.get(`${this.routesURL}visibleroutes`)
      .toPromise()
      .then(response => response.json() as Route[])
      .catch(this.handleError);
  }

  getRoute(id: number): Promise<Route> {
    const url = `${this.routesURL}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Route)
      .catch(this.handleError);
  }

  getAllRouteDetails(): Promise<RouteDetail[]> {
    return this.http.get(`${this.routeDetailsURL}allroutedetails`)
      .toPromise()
      .then(response => response.json() as RouteDetail[])
      .catch(this.handleError);
  }

  getRouteDetail(id: number): Promise<RouteDetail> {
    return this.http.get(`${this.routeDetailsURL}/${id}`)
      .toPromise()
      .then(response => response.json() as RouteDetail)
      .catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getRouteList (cb: Function): any {
    console.log('getroutelist top');
    this.storage.ready().then(() => {
      console.log('getroutelist storage ready');
      this.storage.get('routes').then((routes) => {
        console.log('getroutelist list retrieved', routes);
        if (routes && routes.list.length > 0) {
          console.log('list length > 0 and it exists');
          let now = moment();
          let diff = now.diff(routes.time, 'days')
          console.log('the diference is', diff);
          if (diff <= 1) {
            console.log('Routeservice forage, returning list');
            cb(new Promise((resolve, reject) => {
              resolve(routes.list);
            }))
          } else {
            console.log('Routeservice forage, list is too old!');
            cb(this.getAllRoutes());
          }
        }
        else {
          console.log('Routeservice forage, download routes');
          cb(this.getAllRoutes());
        }
      }).catch(err => {
        console.error('an error getting routes from storage!', err);
      });
    });
  }
  saveRouteList(routes: Route[]): void {
    console.log('passed', routes);
    this.storage.ready().then(() => {
      this.storage.set('routes', {
        list: routes,
        time: new Date()
      });
      this.storage.get('routes').then((routes) => {
        console.log('loaded', routes);
      })
    })
  }
}