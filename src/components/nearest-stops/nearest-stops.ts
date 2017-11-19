import {Component, OnInit, OnChanges, SimpleChanges, Input, Output, ChangeDetectorRef} from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import {StopService} from "../../providers/stop.service";
import {Geoposition} from "@ionic-native/geolocation";


/**
 * Generated class for the NearestStopsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'nearest-stops',
  templateUrl: 'nearest-stops.html',
})
export class NearestStops implements OnInit {

    @Input() stops;
 @Input() limit;
 @Input() position: Geoposition;
  numberOfStopsToShow: number = 5;

  constructor(private stopSvc: StopService, private changeDetector: ChangeDetectorRef) {
    console.log('Hello NearestStopsComponent Component');
  }
  ngOnInit() {
    console.log(this);
    this.limit = this.limit ? parseInt(this.limit, 10) : 5;
    if (this.stops && typeof this.stops === 'string') {
      // console.log('new propsss' + this.stops);
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
            // console.log('new propsss' + newProp);
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
    /*
     * Adds more stops to the Nearby Stops section of the page.
     * When a stop being added has an unknown distance from us,
     * we calculate it.
     * @param howManyMore - The number of additional stops we want to show
     */
    seeMoreStops(): void {
        // Check for/calculate distance to each stop we're about to show
        for (let i = this.numberOfStopsToShow; i < this.numberOfStopsToShow + 5; i++) {
            if (!this.stops[i].hasOwnProperty('Distance')) {
                // Calculate the distance from us to the stop
                this.stops[i].Distance = this.stopSvc.calculateStopDistance(
                    this.position, this.stops[i]
                );
            }
        }
        this.numberOfStopsToShow += 5;
        this.changeDetector.detectChanges();

    }

}
