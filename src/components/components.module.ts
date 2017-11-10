import { NgModule } from '@angular/core';
import { StopDeparturesComponent } from './stop-departures/stop-departures';
import { NearestStops } from './nearest-stops/nearest-stops';
@NgModule({
  declarations: [StopDeparturesComponent, NearestStops],
  imports: [],
  exports: [StopDeparturesComponent, NearestStops]
})
export class ComponentsModule {}
