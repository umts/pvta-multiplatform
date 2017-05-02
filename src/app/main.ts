import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

import { gaInit } from './ga.ts';
gaInit();

declare const ENV, ga;


let head = document.getElementsByTagName('head')[0];

if (ENV.ga) {
  ga('create', ENV.ga_id, 'auto');
  var analyticsMeta = document.createElement('meta');
  analyticsMeta.name = 'google-site-verification';
  analyticsMeta.content = ENV.ga_meta;
  head.appendChild(analyticsMeta);
}

platformBrowserDynamic().bootstrapModule(AppModule);
