import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class DepartureSortService {

  constructor(public storage: Storage) {  }

  validate(sort: string): string {
    if (sort === 'route' || sort === 'time') {
      return sort;
    } else {
      this.storage.set('departureSort', 'route');
      return 'route';
    }
  }
}
