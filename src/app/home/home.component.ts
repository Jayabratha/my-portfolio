import { Component, Input } from '@angular/core';
import { AppStateService } from '../app-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './../common.styles.css']
})
export class HomeComponent {
  constructor(private appState: AppStateService) {
    this.appState.setHeaderState(false);
  }
}
