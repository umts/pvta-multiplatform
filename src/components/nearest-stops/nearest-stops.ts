import {
    Component, OnInit, OnChanges, SimpleChanges, Input, Output, ChangeDetectorRef,
    EventEmitter
} from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import {StopService} from "../../providers/stop.service";
import {Geoposition} from "@ionic-native/geolocation";
import {Stop} from "../../models/stop.model";


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
    @Input() position: Geoposition;
    @Output() onShowRightPanelClick: EventEmitter<any> = new EventEmitter<any>();
    numberOfStopsToShow: number = 5;
    selectedStop: Stop;

  constructor(private stopSvc: StopService, private changeDetector: ChangeDetectorRef) {
    console.log('Hello NearestStopsComponent Component');
  }
  ngOnInit() {
    console.log(this);
    if (this.stops && typeof this.stops === 'string') {
      this.stops = JSON.parse(this.stops);
    }
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
    seeFewerStops() {
        this.numberOfStopsToShow = this.numberOfStopsToShow - 5;
        this.changeDetector.detectChanges();
    }

    onRowClick(stop: Stop) {
        this.selectedStop = stop;
        this.onShowRightPanelClick.emit(stop);
    }

}
