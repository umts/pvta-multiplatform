class Stop {
  StopId: number;
  StopRecordId: number;
  Name: string;
  Description: string;
  Latitude: number;
  Longitude: number;
  IsTimePoint: boolean;
  constructor(StopId: number, StopRecordId: number, Name: string, Description: string,
    Latitude: number, Longitude: number, IsTimePoint: boolean) {
      this.StopId = StopId;
      this.StopRecordId = StopRecordId;
      this.Name = Name;
      this.Description = Description;
      this.Latitude = Latitude;
      this.Longitude = Longitude;
      this.IsTimePoint = IsTimePoint;
  }
}
