import { Injectable } from '@angular/core';

@Injectable()
export class InfoService {

  constructor() {
  }

  getVersionNumber(): string {
    return '2.0.0';
  }

  getVersionName(): string {
    return 'UI Overhaul Beta 3';
  }

}
