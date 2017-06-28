import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class AutoRefreshService {

  constructor(public storage: Storage) { }

  verifyValidity(autoRefresh: number): [boolean, number] {
    if (autoRefresh != null) {
      return [true, autoRefresh];
    } else {
      this.storage.set('autoRefresh', 45000);
      return [false, 45000];
    }
  }
  isAutoRefreshEnabled(autoRefresh: any): boolean {
    if (autoRefresh > -1) {
      return true;
    } else {
      return false;
    }
  }
}
