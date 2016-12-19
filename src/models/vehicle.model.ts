export class Vehicle {
  VehicleId: number;
  Name: string;
  Latitude: number;
  Longitude: number;
  RouteId: number;
  TripId: number;
  RunId: number;
  Direction: string;
  DirectionLong: string;
  Destination: string;
  Speed: any;
  Heading: number;
  Deviation: number;
  OpStatus: string;
  CommStatus: string;
  GPSStatus: number;
  DriverName: any;
  LastStop: string;
  OnBoard: number;
  LastUpdated: any;
  DisplayStatus: string;
  BlockFareboxId: number;
  constructor(VehicleId: number, Name: string, Latitude: number, Longitude: number,
    RouteId: number, TripId: number, RunId: number, Direction: string,
    DirectionLong: string, Destination: string, Speed: any, Heading: number,
    Deviation: number, OpStatus: string, CommStatus: string, GPSStatus: number,
    DriverName: any, LastStop: string, OnBoard: number, LastUpdated: any,
    DisplayStatus: string, BlockFareboxId: number) {
    this.VehicleId = VehicleId;
    this.Name = Name;
    this.Latitude = Latitude;
    this.Longitude = Longitude;
    this.RouteId = RouteId;
    this.TripId = TripId;
    this.RunId = RunId;
    this.Direction = Direction;
    this.DirectionLong = DirectionLong;
    this.Destination = Destination;
    this.Speed = Speed;
    this.Heading = Heading;
    this.Deviation = Deviation;
    this.OpStatus = OpStatus;
    this.CommStatus = CommStatus;
    this.GPSStatus = GPSStatus;
    this.DriverName = DriverName;
    this.LastStop = LastStop;
    this.OnBoard = OnBoard;
    this.LastUpdated = LastUpdated;
    this.DisplayStatus = DisplayStatus;
    this.BlockFareboxId = BlockFareboxId;
  }
}
