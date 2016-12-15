class Route {
  shortName: string;
  longName: string;
  color: number;
  routeId: number;
  constructor(shortName: string, longName: string, color: number, routeId: number){
    this.shortName = shortName;
    this.longName = longName;
    this.color = color;
    this.routeId = routeId;
  }
}
