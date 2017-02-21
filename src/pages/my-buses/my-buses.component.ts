import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { StopComponent } from '../stop/stop.component';
import { RouteComponent } from '../route/route.component';

@Component({
  selector: 'page-my-buses',
  templateUrl: 'my-buses.html'
})
export class MyBusesComponent {

  constructor(public navCtrl: NavController) {

  }

  stops: any = [
    {
      Description: "The Boulders Apts",
      StopId: 157
    },
    {
      Description: "Arnold House",
      StopId: 56
    },
    {
      Description: "Fine Arts Center",
      StopId: 71
    }
  ];

  routes: any = [
    {
      Color: "C7A020",
      GoogleDescription: "North Amherst / Old Belchertown Rd",
      RouteAbbreviation: "30",
      RouteId: 20030,
      ShortName:"30"
    },
    {
      Color: "C7A020",
      GoogleDescription: "Sunderland / South Amherst",
      RouteAbbreviation: "31",
      RouteId: 20031,
      ShortName:"31"
    },
    {
      Color: "C7A020",
      RouteAbbreviation: "46",
      RouteId: 20046,
      ShortName:"46"
    },
    {
      Color: "C7A020",
      RouteAbbreviation: "B43",
      RouteId: 30043,
      ShortName:"B43"
    }
  ];

  messages: any = [
      {
        MessageId: 0,
        Message: "The Route 30 is bypassing Colonial Village due to snow. Catch buses on Route 9.",
        FromDate: "2017-02-04T20:24:42.916Z",
        ToDate: "2017-02-04T20:24:42.916Z",
        FromTime: "2017-02-04T20:24:42.916Z",
        ToTime: "2017-02-04T20:24:42.916Z",
        Priority: 0,
        DaysOfWeek: 1,
        Published: true,
        PublicAccess: 0,
        Routes: [
          20030
        ],
        Signs: [],
        MessageTranslations: [],
        ChannelMessages: []
      }
    ];
    goToStopPage(stopId: number): void {
      this.navCtrl.push(StopComponent, {
        stopId: stopId
      });
    }
    goToRoutePage(routeId: number): void {
      this.navCtrl.push(RouteComponent, {
        routeId: routeId
      });
    }
}
