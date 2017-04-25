import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class AutoRefreshService {

  constructor(public storage: Storage) { }

  verifyValidity(autoRefresh: number): [boolean, number] {
    if (autoRefresh != null) {
      console.log('autorefresh is valid');
      return [true, autoRefresh];
    } else {
      console.log('autorefresh is invalid');
      this.storage.set('autoRefresh', 45000);
      return [false, 45000];
    }
  }
  isAutoRefreshEnabled(autoRefresh: any): boolean {
    if (autoRefresh > -1) {
      console.log('autorefresh is enabled');
      return true;
    } else {
      console.log('autorefresh is disabled');
      return false;
    }
  }
}
