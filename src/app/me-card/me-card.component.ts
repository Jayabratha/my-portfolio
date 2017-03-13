import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'me-card',
  templateUrl: './me-card.component.html',
  styleUrls: ['./me-card.component.css', './../common.styles.css']
})
export class MeCardComponent {
  @Output() onStateChange = new EventEmitter<string>();

  isInitial: boolean = true;
  showMenu: boolean = false;
  isHeaderFix : boolean;
  activeNav: string = "";

  constructor() {
    setTimeout(() => {
      this.isInitial = false;
    }, 2000);
  }

  headerStateChange(state: string) {
    if (state === 'fix') {
      this.isHeaderFix = true;
      this.onStateChange.emit('enable');
    } else if (state === 'scroll' && this.isHeaderFix) {
      this.isHeaderFix = false;
      this.onStateChange.emit('restore');
      console.log("Restore");
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
