import { Component } from '@angular/core';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
import { NavController } from 'ionic-angular';
import { InfoService } from '../../providers/info.service';

declare var ga;

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutComponent {
  versionName;
  versionNumber;
  constructor(public navCtrl: NavController, infoService: InfoService) {
    this.versionName = infoService.getVersionName();
    this.versionNumber = infoService.getVersionNumber();
    ga('set', 'page', '/settings/about.html');
    ga('send', 'pageview');
  }
  goToPrivacyPolicyPage(): void {
    this.navCtrl.push(PrivacyPolicyComponent);
  }
}
