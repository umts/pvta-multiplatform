import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

declare const ENV;
declare var ga;

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

var head = document.getElementsByTagName('head')[0];
var mapsApi = document.createElement('script');
mapsApi.src = 'https://maps.googleapis.com/maps/api/js?libraries=places,geometry&key=' + ENV.gmaps_key;
head.appendChild(mapsApi);

if (ENV.ga) {
  ga('create', ENV.ga_id, 'auto');
  var analyticsMeta = document.createElement('meta');
  analyticsMeta.name = 'google-site-verification';
  analyticsMeta.content = ENV.ga_meta;
  head.appendChild(analyticsMeta);
}

platformBrowserDynamic().bootstrapModule(AppModule);
