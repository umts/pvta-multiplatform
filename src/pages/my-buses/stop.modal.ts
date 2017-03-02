import { Component } from '@angular/core';
import { FavoriteStopService, FavoriteStopModel } from '../../providers/favorite-stop.service';
import { Storage } from '@ionic/storage';
import { NavController, Platform, NavParams, ModalController, LoadingController, ViewController } from 'ionic-angular';
import { Stop } from '../../models/stop.model';
import { StopComponent } from '../stop/stop.component';
import { StopService} from '../../providers/stop.service';
import * as _ from 'lodash';



@Component({
  templateUrl: 'stop.modal.html'
})
export class MyBusesStopModal {
  searchQuery: string = '';
  character;
  stops: Stop[];
  stopsDisp: Stop[];
  favoriteStops: FavoriteStopModel[];
  constructor(
    public platform: Platform,
    public params: NavParams, private loadingCtrl: LoadingController,
    public viewCtrl: ViewController, private storage: Storage,
    public navCtrl: NavController, public stopService: StopService
  ) {
    }

  goToStopPage(stopId: number): void {
    this.navCtrl.push(StopComponent, {
      stopId: stopId
    });
  }
  onSearchQueryChanged(event: any): void {
    let query: string = event.target.value;
    console.log(query);
    if (!query || query == '') {
      this.stopsDisp = this.stops;
    }
    else {
      this.stopsDisp = this.stopService.filterStopsByQuery(this.stops, query);
    }
  }

  ionViewWillEnter() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.stopService.getStopList((stopsPromise: Promise<Stop[]>) => {
      stopsPromise.then(stops => {
        this.stops = _.uniqBy(stops, 'StopId');
        this.stopsDisp = this.stops;
        this.stopService.saveStopList(this.stops);
        this.getFavoriteStops();
        loader.dismiss();
      });
    });
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
      })
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
