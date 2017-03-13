import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './common.styles.css']
})
export class AppComponent {
  restoreInitial : boolean = false;

  restoreOverviewsInitial(state: string) {
    if (state === 'enable') {
      this.restoreInitial = false;
    } else if (state === 'restore') {
      this.restoreInitial = true;
    }
  }
}
