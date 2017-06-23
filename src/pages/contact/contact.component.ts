import { Component } from '@angular/core';

declare var ga;

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactComponent {
  constructor() {
    ga('set', 'page', '/settings/contact.html');
    ga('send', 'pageview');
  }
}
