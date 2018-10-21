import { Component, OnInit } from '@angular/core';
import { routeAnimation } from '../animations/animations';

import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { Header } from '../models/header.model';
import { HeaderState } from '../models/header-state.enum';
import * as HeaderActions from '../actions/header.actions';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css', './../app.component.css', './../common.styles.css'],
  animations: [routeAnimation()],
  host: { '[@routeAnimation]': '' }
})
export class BlogComponent implements OnInit {

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.dispatch(new HeaderActions.UpdateState(HeaderState.Fixed));
    this.store.dispatch(new HeaderActions.ToggleMenu(false));
  }

}
