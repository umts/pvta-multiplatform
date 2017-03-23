import { Component } from '@angular/core';

import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { RouteService } from '../../providers/route.service';
import { VehicleService } from '../../providers/vehicle.service';
import { AlertService } from '../../providers/alert.service';
import { FavoriteRouteService } from '../../providers/favorite-route.service';
import { RouteDetail } from '../../models/route-detail.model';
import { Vehicle } from '../../models/vehicle.model';
import { Alert } from '../../models/alert.model';
import { Stop } from '../../models/stop.model';
import { RouteMapComponent } from '../route-map/route-map.component';
import { StopModal, StopModalRequester } from '../../modals/stop-modal/stop.modal';
import { ConnectivityService } from '../../providers/connectivity.service';

@Component({
  selector: 'page-route',
  templateUrl: 'route.html'
})
export class RouteComponent {
  routeId: number;
  route: RouteDetail;
  vehicles: Vehicle[];
  alerts: Alert[];
  stops: Stop[];
  constructor(public navCtrl: NavController, private navParams: NavParams,
    private routeService: RouteService, private vehicleService: VehicleService,
    private alertService: AlertService, private connection: ConnectivityService,
    private modalCtrl: ModalController, private favoriteRouteService: FavoriteRouteService,
    private alertCtrl: AlertController) {
    this.routeId = navParams.get('routeId');
    this.alerts = [];
  }

  getVehicles (): void {
    // this.vehicleService
    //   .getRouteVehicles(this.routeId)
    //   .then(vehicles => this.vehicles = vehicles);
  }
  /**
  * Download any Alerts for the current route
  * and display them.
  */
  getAlerts (): void {
    this.alerts = [];
    this.alertService
    .getAlerts()
    .then(alerts => {
      if (!alerts) {
        return;
      }
      for (let alert of alerts) {
        console.log(alert.Routes.includes(this.routeId));
        if (alert.Routes.includes(this.routeId)) {
          this.alerts.push(alert);
        }
      }
      console.log(JSON.stringify(this.alerts));
    });
  }

  toggleRouteHeart(route): void {
    this.favoriteRouteService.toggleFavorite(route);
  }

  showStopModal (): void {
    let stopModal = this.modalCtrl.create(StopModal,
      {
        title: `Stops on the ${this.route.RouteAbbreviation}`,
        requester: StopModalRequester.Route,
        stops: this.stops
      }
    );
    stopModal.present();
 }


  prepareStops (stops: Stop[]): void {
    this.stops = stops;
    // $scope.stops = [];
    // FavoriteStops.getAll().then(function (favoriteStops) {
    //   var favoriteStopIds = _.pluck(favoriteStops, 'StopId');
    //   for (var index = 0; index < stops.length; index++) {
    //     var stop = stops[index];
    //     var liked = false;
    //     // If the ID of the stop in question is in the list of favorite stop IDs
    //     if (_.contains(favoriteStopIds, stop.StopId)) {
    //       liked = true;
    //     }
    //     $scope.stops.push({StopId: stop.StopId, Description: stop.Description, Liked: liked});
    //   }
    // });
  }

  goToRouteMapPage(): void {
    this.navCtrl.push(RouteMapComponent, {
      routeId: this.routeId
    }).catch(() => {
      this.alertCtrl.create({
        title: 'No Connection',
        subTitle: 'The map page requires an internet connection',
        buttons: ['Dismiss']
      }).present();
    });
  }

  ionViewCanEnter(): boolean {
   return this.connection.getConnectionStatus();
  }

  ionViewWillEnter() {
    this.getAlerts();
    this.routeService
      .getRouteDetail(this.routeId)
      .then(route => {
        if (!route) {
          return;
        }
        this.route = route;
        // getHeart()
        this.prepareStops(route.Stops);
        this.vehicles = route.Vehicles;
        this.favoriteRouteService.contains(route, (liked) => {
          this.route.Liked = liked;
        });
      });
  }
}
