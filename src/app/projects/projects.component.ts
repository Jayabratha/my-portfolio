import { Component } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { routeAnimation } from '../animations/animations';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css', './../app.component.css', './../common.styles.css'],
  animations: [routeAnimation()],
  host: { '[@routeAnimation]': '' }
})
export class ProjectsComponent {

  constructor(private appState: AppStateService) {
    this.appState.setHeaderState(true);
  }

}
