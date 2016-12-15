class RouteDetails {
  RouteId: number;
  RouteRecordId: number;
  ShortName: string;
  LongName: string;
  RouteAbbreviation: string;
  IvrDescription: string;
  Color: string;
  TextColor: string;
  IsVisible: boolean;
  Group: any;
  SortOrder: number;
  RouteTraceFilename: string;
  RouteTraceHash64: any;
  IsHeadway: boolean;
  IncludeInGoogle: boolean;
  GoogleDescription: string;
  Stops: Stop[];
  RouteStops: any[];
  Directions: any[];
  Vehicles: Vehicle[];
  Messages: Alert[];
  constructor(shortName: string, longName: string, color: number, routeId: number){
    this.shortName = shortName;
    this.longName = longName;
    this.color = color;
    this.routeId = routeId;
  }
}
