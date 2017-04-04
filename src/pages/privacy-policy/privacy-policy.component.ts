import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

declare var ga;

@Component({
  selector: 'page-privacy-policy',
  templateUrl: 'privacy-policy.html'
})
export class PrivacyPolicyComponent {

  constructor(public navCtrl: NavController) {
    ga('set', 'page', '/settings/about/privacy-policy.html');
    ga('send', 'pageview');
  }

}
