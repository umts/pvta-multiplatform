import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

import { gaInit } from './ga.ts';
gaInit();

declare const ENV, ga;

window['bootstrap'] = () => {
  platformBrowserDynamic().bootstrapModule(AppModule);
}
let head = document.getElementsByTagName('head')[0];
console.log('mapsscript');
var mapsApi = document.createElement('script');
mapsApi.src = `https://maps.googleapis.com/maps/api/js?libraries=places,geometry&key=${ENV.gmaps_key}&callback=bootstrap`;
head.appendChild(mapsApi);



if (ENV.ga) {
  ga('create', ENV.ga_id, 'auto');
  var analyticsMeta = document.createElement('meta');
  analyticsMeta.name = 'google-site-verification';
  analyticsMeta.content = ENV.ga_meta;
  head.appendChild(analyticsMeta);
}
