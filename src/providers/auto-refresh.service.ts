import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class AutoRefreshService {

  constructor(public storage: Storage) { }

  isAutoRefreshValid(autoRefresh: any): boolean {
    if (autoRefresh != null) {
      console.log('autorefresh is valid');
      return true;
    } else {
      console.log('autorefresh is invalid');
      return false;
    }
  }
  isAutoRefreshEnabled(autoRefresh: any): boolean {
    if (autoRefresh > 0) {
      console.log('autorefresh is enabled');
      return true;
    } else {
      console.log('autorefresh is disabled');
      return false;
    }
  }
}
