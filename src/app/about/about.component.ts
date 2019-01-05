import { Component, ViewChildren, QueryList, ElementRef, Renderer2, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { Header } from '../models/header.model';
import { HeaderState } from '../models/header-state.enum';
import * as HeaderActions from '../actions/header.actions';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css', './../app.component.css', './../common.styles.css']
})
export class AboutComponent implements OnInit {
  @ViewChildren('skillItem') skillItems: QueryList<ElementRef>;

  constructor(
    private store: Store<AppState>,
    private renderer: Renderer2) {
  }

  ngOnInit() {
    this.store.dispatch(new HeaderActions.UpdateState(HeaderState.Fixed));
    this.store.dispatch(new HeaderActions.ToggleMenu(false));
  }

  animateSkills() {
    if (this.skillItems) {
      setTimeout(() => {
        this.skillItems.forEach((elem, index) => {
          setTimeout(() => {
            this.renderer.removeClass(elem.nativeElement, 'hide');
          }, index * 150);
        });
      }, 500);
    }
  }

}
