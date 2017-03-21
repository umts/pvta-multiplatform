import { Component } from '@angular/core';
import { FavoriteRouteService, FavoriteRouteModel } from '../../providers/favorite-route.service';
import { Storage } from '@ionic/storage';
import { NavController, Platform, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { Route } from '../../models/route.model';
import { RouteService} from '../../providers/route.service';
import * as _ from 'lodash';

export enum RouteModalRequester { MyBuses }

@Component({
  templateUrl: 'route.modal.html'
})
export class RouteModal {
  searchQuery: string = '';
  character;
  routes: Route[];
  favoriteRoutes: FavoriteRouteModel[];
  requester: RouteModalRequester;
  title: string;
  constructor(
    public platform: Platform, private favoriteRouteService: FavoriteRouteService,
    public params: NavParams, private loadingCtrl: LoadingController,
    public viewCtrl: ViewController, private storage: Storage,
    public navCtrl: NavController, public routeService: RouteService
  ) {
    this.requester = <RouteModalRequester> this.params.get('requester');
    this.title = this.params.get('title');
    }
  ionViewWillEnter() {
    if (this.requester === RouteModalRequester.MyBuses) {
      let loader = this.loadingCtrl.create();
      loader.present();
      this.routeService.getRouteList().then((routes: Route[]) => {
        console.log('have routes');
        this.routes = _.sortBy(routes, ['ShortName']);
        this.routeService.saveRouteList(this.routes);
        this.getFavoriteRoutes();
        loader.dismiss();
      }).catch(err => {
        console.error(err);
      });
    }
  }

  getFavoriteRoutes(): void {
    this.storage.ready().then(() => {
      this.storage.get('favoriteRoutes').then((favoriteRoutes: FavoriteRouteModel[]) => {
        // console.log('favs', favoriteRoutes);
        this.favoriteRoutes = favoriteRoutes;
        this.routes = this.routeService.prepareRoutes(this.favoriteRoutes, this.routes);
        console.log('FLKJDFKLJLDFJLKAJF', this.routes)
      })
    })
  }

  toggleRouteHeart(route: Route): void {
    this.favoriteRouteService.toggleFavorite(route);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
