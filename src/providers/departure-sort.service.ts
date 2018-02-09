import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class DepartureSortService {

  constructor(public storage: Storage) {  }

  verifyValidity(sort: string): [boolean, string] {
    if (sort === 'route' || sort === 'time') {
      return [true, sort];
    } else {
      this.storage.set('departureSort', 'route');
      return [false, 'route'];
    }
  }
}
