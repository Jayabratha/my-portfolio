import { Component } from '@angular/core';

@Component({
  selector: 'me-card',
  templateUrl: './me-card.component.html',
  styleUrls: ['./me-card.component.css']
})
export class MeCardComponent {

  isHeaderFix : boolean;

  headerStateChange(state: string) {
    if (state === 'fix') {
      this.isHeaderFix = true;
    } else if (state === 'scroll') {
      this.isHeaderFix = false;
    }
  }
  // constructor() { }

  // ngOnInit() {
  // }


}
