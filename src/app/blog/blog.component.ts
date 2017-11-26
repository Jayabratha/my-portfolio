import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { routeAnimation } from '../animations/animations';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css', './../app.component.css', './../common.styles.css'],
  animations: [routeAnimation()],
  host: { '[@routeAnimation]': '' }
})
export class BlogComponent implements OnInit {

  constructor(private appState: AppStateService) {
    this.appState.setHeaderState(true);
  }

  ngOnInit() {
  }

}
