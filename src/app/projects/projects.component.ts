import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app-store/app.state';
import { HeaderState } from '../models/header-state.enum';
import * as HeaderActions from '../app-store/actions/header.actions';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css', './../app.component.css']
})
export class ProjectsComponent implements OnInit {

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.dispatch(new HeaderActions.UpdateState(HeaderState.Fixed));
    this.store.dispatch(new HeaderActions.ToggleMenu(false));
  }

}
