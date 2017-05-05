import { Stop } from './stop.model';
import { Vehicle } from './vehicle.model';
import { Alert } from './alert.model';
export class RouteDetail {
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
  Liked: boolean;
  constructor(RouteId: number, RouteRecordId: number, ShortName: string,
    LongName: string, RouteAbbreviation: string, IvrDescription: string,
    Color: string, TextColor: string, IsVisible: boolean, Group: any,
    SortOrder: number, RouteTraceFilename: string, RouteTraceHash64: any,
    IsHeadway: boolean, IncludeInGoogle: boolean, GoogleDescription: string,
    Stops: Stop[], RouteStops: any[], Directions: any[], Vehicles: Vehicle[],
    Messages: Alert[], Liked: boolean) {
    this.RouteId = RouteId;
    this.RouteRecordId = RouteRecordId;
    this.ShortName = ShortName;
    this.LongName = LongName;
    this.RouteAbbreviation = RouteAbbreviation;
    this.IvrDescription = IvrDescription;
    this.Color = Color;
    this.TextColor = TextColor;
    this.IsVisible = IsVisible;
    this.Group = Group;
    this.SortOrder = SortOrder;
    this.RouteTraceFilename = RouteTraceFilename;
    this.RouteTraceHash64 = RouteTraceHash64;
    this.IsHeadway = IsHeadway;
    this.IncludeInGoogle = IncludeInGoogle;
    this.GoogleDescription = GoogleDescription;
    this.Stops = Stops;
    this.RouteStops = RouteStops;
    this.Directions = Directions;
    this.Vehicles = Vehicles;
    this.Messages = Messages;
    this.Liked = Liked;
  }
}
