import { Component } from '@angular/core';

import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { RouteService } from '../../services/route.service';
import { VehicleService } from '../../services/vehicle.service';
import { AlertService } from '../../services/alert.service';
import { RouteDetail } from '../../models/route-detail.model';
import { Vehicle } from '../../models/vehicle.model';
import { Alert } from '../../models/alert.model';
import { Stop } from '../../models/stop.model';
import * as _ from 'lodash';

@Component({
  selector: 'page-route',
  templateUrl: 'route.html'
})
export class RouteComponent {
  routeId: number;
  route: RouteDetail;
  vehicles: Vehicle[];
  alerts: Alert[] = [];
  stops: Stop[];
  constructor(public navCtrl: NavController, private navParams: NavParams,
    private routeService: RouteService, private vehicleService: VehicleService,
    private alertService: AlertService) {
    this.routeId = navParams.get('routeId');
  }

  getVehicles (): void {
    this.vehicleService
      .getRouteVehicles(this.routeId)
      .then(vehicles => this.vehicles = vehicles);
  }
  /**
  * Download any Alerts for the current route
  * and display them.
  */
  getAlerts (): void {
    this.alertService
    .getAlerts()
    .then(alerts => {
      for (let alert of alerts) {
        //this.vehicles = vehicles;
        if (alert.Routes.includes(this.routeId)) {
          this.alerts.push(alert);
        }
      }
      console.log(JSON.stringify(this.alerts));
    });
  }

  showStopModal (): void {
    //  $ionicModal.fromTemplateUrl('pages/route/stop-modal.html', {
    //    scope: $scope
    //  }).then(function (modal) {
    //    $scope.stopModal = modal;
    //    $scope.stopModal.show();
    //  });
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

  ionViewWillEnter() {
    this.getAlerts();
    this.routeService
      .getRouteDetail(this.routeId)
      .then(route => {
        this.route = route;
        //getHeart()
        this.prepareStops(route.Stops);
        this.vehicles = route.Vehicles;
        //$ionicLoading.hide();
      });
  }
}
@Component({
  templateUrl: 'stop.modal.html'
})

export class StopModal {
  character;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    var characters = [
      {
        name: 'Gollum',
        quote: 'Sneaky little hobbitses!',
        image: 'assets/img/avatar-gollum.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'River Folk' },
          { title: 'Alter Ego', note: 'Smeagol' }
        ]
      },
      {
        name: 'Frodo',
        quote: 'Go back, Sam! I\'m going to Mordor alone!',
        image: 'assets/img/avatar-frodo.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'Shire Folk' },
          { title: 'Weapon', note: 'Sting' }
        ]
      },
      {
        name: 'Samwise Gamgee',
        quote: 'What we need is a few good taters.',
        image: 'assets/img/avatar-samwise.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'Shire Folk' },
          { title: 'Nickname', note: 'Sam' }
        ]
      }
    ];
    this.character = characters[this.params.get('charNum')];
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
