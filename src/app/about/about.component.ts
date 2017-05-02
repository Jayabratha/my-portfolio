import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { routeAnimation } from '../animations/animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css', './../app.component.css', './../common.styles.css'],
  animations: [routeAnimation()],
  host: { '[@routeAnimation]': '' }
})
export class AboutComponent {

  constructor(private appState: AppStateService) {
    this.appState.setHeaderState(true);
  }

}
