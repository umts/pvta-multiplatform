export class Alert {
  MessageId: number;
  Message: string;
  FromDate: any;
  ToDate: any;
  FromTime: any;
  ToTime: any;
  Priority: number;
  DaysOfWeek: number;
  Published: boolean;
  PublicAccess: number;
  Routes: number[];
  Signs: any[];
  MessageTranslations: any[];
  constructor(MessageId: number, Message: string, FromDate: any, ToDate: any,
    FromTime: any, ToTime: any, Priority: number, DaysOfWeek: number,
    Published: boolean, PublicAccess: number, Routes: number[], Signs: any[],
    MessageTranslations: any[]) {
      this.MessageId = MessageId;
      this.Message = Message;
      this.FromDate = FromDate;
      this.ToDate = ToDate;
      this.FromTime = FromTime;
      this.ToTime = ToTime;
      this.Priority = Priority;
      this.DaysOfWeek = DaysOfWeek;
      this.Published = Published;
      this.PublicAccess = PublicAccess;
      this.Routes = Routes;
      this.Signs = Signs;
      this.MessageTranslations = MessageTranslations;
  }
}
