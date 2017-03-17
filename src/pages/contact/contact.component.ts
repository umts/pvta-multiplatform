import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
  declare var ga;
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactComponent {

  constructor(public navCtrl: NavController) {
    ga('set', 'page', '/about/contact.html');
    ga('send', 'pageview');
  }

}
