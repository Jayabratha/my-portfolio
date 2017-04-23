import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from './app-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './common.styles.css'],
  providers: [AppStateService]
})
export class AppComponent {
  
}
