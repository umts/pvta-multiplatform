import { Component } from '@angular/core';
import { FavoriteStopService, FavoriteStopModel } from '../../providers/favorite-stop.service';
import { Storage } from '@ionic/storage';
import { NavController, Platform, NavParams, LoadingController, ViewController, AlertController } from 'ionic-angular';
import { Stop } from '../../models/stop.model';
import { StopComponent } from '../../pages/stop/stop.component';
import { StopService} from '../../providers/stop.service';
import * as _ from 'lodash';

export enum StopModalRequester {
  MyBuses, Route
}

@Component({
  templateUrl: 'stop.modal.html'
})
export class StopModal {
  searchQuery: string = '';
  character;
  stops: Stop[];
  stopsDisp: Stop[] = [];
  favoriteStops: FavoriteStopModel[];
  requester: StopModalRequester;
  title: string;
  ariaTitle;
  constructor(
    public platform: Platform, private favoriteStopService: FavoriteStopService,
    public params: NavParams, private loadingCtrl: LoadingController,
    public viewCtrl: ViewController, private storage: Storage,
    public navCtrl: NavController, public stopService: StopService,
    private alertCtrl: AlertController
  ) {
    this.requester = <StopModalRequester> this.params.get('requester');
    this.title = this.params.get('title');
    if (this.requester === StopModalRequester.MyBuses) {
      this.ariaTitle = 'Add favorite stops popup. Check the stops you want to favorite, and click done.';
    } else {
      this.ariaTitle = this.title;
      this.stops = this.params.get('stops');
      this.stopsDisp = this.stops;

    }
    }

  goToStopPage(stopId: number): void {
    this.navCtrl.push(StopComponent, {
      stopId: stopId
    }).catch(() => {
      this.alertCtrl.create({
        title: 'No Connection',
        subTitle: 'The Stop page requires an Internet connection',
        buttons: ['Dismiss']
      }).present();
    });
  }
  onSearchQueryChanged(event: any): void {
    let query: string = event.target.value;
    this.stopsDisp = this.stopService.filterStopsByQuery(this.stops, query);
  }

  ionViewWillEnter() {
    if (this.requester === StopModalRequester.MyBuses) {
      let loader = this.loadingCtrl.create();
      loader.present();
      this.stopService.getStopList().then((stops: Stop[]) => {
        this.stops = _.uniqBy(stops, 'StopId');
        this.stopService.saveStopList(this.stops);
        this.getFavoriteStops();
        loader.dismiss();
      });
    }
  }

  toggleStopHeart(stop: Stop): void {
    this.favoriteStopService.toggleFavorite(stop.StopId, stop.Description);
  }

  prepareStops(): any {
    // For each route, add the custom 'Liked' property and keep only
    // the properties we care about.  Doing this makes searching easier.
    return _.map(this.stops, (stop) => {
      stop.Liked = _.includes(_.map(this.favoriteStops, 'StopId'), stop.StopId);
      return _.pick(stop, 'StopId', 'Name', 'Liked', 'Description', 'Latitude', 'Longitude', 'Distance');
    });
  }
  getFavoriteStops(): void {
    this.storage.ready().then(() => {
      this.storage.get('favoriteStops').then((favoriteStops: Stop[]) => {
        this.favoriteStops = favoriteStops;
        this.stops = this.prepareStops();
        this.stopsDisp = this.stops;
      });
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
