export class StopDeparture {
  StopId: number;
  StopRecordId: number;
  RouteDirections: any[];
  LastUpdated: string;
  constructor(StopId: number, StopRecordId: number, RouteDirections: any[], LastUpdated: string, ) {
      this.StopId = StopId;
      this.StopRecordId = StopRecordId;
      this.RouteDirections = RouteDirections;
      this.LastUpdated = LastUpdated;
  }
}
