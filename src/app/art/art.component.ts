import { Component } from '@angular/core';
import { AppStateService } from '../app-state.service';

@Component({
  selector: 'app-art',
  templateUrl: './art.component.html',
  styleUrls: ['./art.component.css']
})
export class ArtComponent {

  constructor(private appState: AppStateService) {
    this.appState.setHeaderState(true);
    console.log("test");
  }

}
