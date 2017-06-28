import { Component, Input } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'vehicle',
  templateUrl: 'vehicle.html'
})
export class VehicleComponent {

  @Input('data') vehicleData;
  @Input('color') vehicleColor;
  vehicles: Vehicle[];
  color: any;

  ngAfterViewChecked() {
    // viewChild is set after the view has been initialized
    this.vehicles = this.vehicleData as Vehicle[];
    this.color = this.vehicleColor;
  }

  constructor() { }
}
