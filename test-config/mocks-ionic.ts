export class StopDepartureServiceMock {
  getStopDeparture(): Promise<any> {
    return new Promise((resolve, reject) => {
        resolve([{}]);
    });
  }
}
export class AlertServiceMock {
  getAlerts(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve([
        {
          MessageId: 0,
          Message: "All routes",
          Routes: []
        },
        {
          MessageId: 1,
          Message: "A 38/39 alert.",
          Routes: [ 20038, 20039 ]
        },
        {
          MessageId: 2,
          Message: "A 35 alert.",
          Routes: [ 20035]
        }
      ]);
    });
  }
}
export class NavParamsMock {
  static returnParam = null;
  public get(key): any {
    if (NavParamsMock.returnParam) {
       return NavParamsMock.returnParam;
    }
    return 'default';
  }
  static setParams(value) {
    NavParamsMock.returnParam = value;
  }
}
export class PlatformMock {
  public ready(): Promise<{String}> {
    return new Promise((resolve) => {
      resolve('READY');
    });
  }

  public getQueryParam() {
    return true;
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return (() => true);
  }

  public hasFocus(ele: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public is(): boolean {
    return true;
  }

  public getElementComputedStyle(container: any): any {
    return {
      paddingLeft: '10',
      paddingTop: '10',
      paddingRight: '10',
      paddingBottom: '10',
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(ele: any, eventName: string, callback: any): Function {
    return (() => true);
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
  }

  public cancelTimeout(id: any) {
    // do nothing
  }

  public getActiveElement(): any {
    return document['activeElement'];
  }
}
