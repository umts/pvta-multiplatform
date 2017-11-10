import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';


/**
 * Generated class for the NearestStopsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'nearest-stops',
  templateUrl: 'nearest-stops.html',
  inputs: ['stops', 'limit', 'seeMoreStops']
})
export class NearestStops implements OnInit {

  stops;
  limit;
  seeMoreStops;

  constructor() {
    console.log('Hello NearestStopsComponent Component');
  }
  ngOnInit() {
    console.log(this.seeMoreStops);
    this.limit = this.limit ? parseInt(this.limit, 10) : 5;
    if (this.stops && typeof this.stops === 'string') {
      console.log('new propsss' + this.stops);
      this.stops = JSON.parse(this.stops);
    }
    console.log(this.stops, this.limit)
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propertyName in changes) {
      let newProp = changes[propertyName].currentValue;
      switch (propertyName) {
        case 'stops': {
          if (newProp && typeof newProp === 'string') {
            console.log('new propsss' + newProp);
            this.stops = JSON.parse(newProp);
          }
          break;
        }
        case 'limit': {
          this.limit = parseInt(newProp, 10);
          break;
        }
      }
    }
  }

}
