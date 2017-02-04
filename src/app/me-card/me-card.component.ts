import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'me-card',
  templateUrl: './me-card.component.html',
  styleUrls: ['./me-card.component.css', './../common.styles.css']
})
export class MeCardComponent {

  isInitial: boolean = true;
  showMenu: boolean = false;
  isHeaderFix : boolean;

  constructor() {
    setTimeout(() => {
      this.isInitial = false;
    }, 2000);
  }

  headerStateChange(state: string) {
    if (state === 'fix') {
      this.isHeaderFix = true;
    } else if (state === 'scroll') {
      this.isHeaderFix = false;
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
