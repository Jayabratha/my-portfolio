import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { AppStateService } from '../app-state.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { Header } from '../models/header.model';
import { HeaderState } from '../models/header-state.enum';
import * as HeaderActions from '../actions/header.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './../common.styles.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  HEADER_STATE = HeaderState;
  headerState: Header;
  steps: Array<number> = [0, 140, 940, 1740, 2540, 3340];
  stepCount: number = 0;
  decounce: boolean = false;
  isMobile: boolean = false;

  constructor(private store: Store<AppState>, private appState: AppStateService) {
  }

  ngOnInit() {
    let deviceWidth = window.screen.width;

    if (deviceWidth < 650) {
      this.isMobile = true;
    }

    this.store.select('header').subscribe((headerState: Header) => {
      this.headerState = headerState;
    });

    if (this.headerState.state === HeaderState.Fixed) {
      this.store.dispatch(new HeaderActions.UpdateState(HeaderState.Home))
    }

    if (!this.isMobile) {
      setTimeout(() => {
        this.store.dispatch(new HeaderActions.ToggleMenu(true));
      }, 800);
    }
  }

  updateSlideCount(state: string, count: number) {
    this.stepCount = count;
  }

  setStepCount(stepCount) {
    if (stepCount === 0) {
      this.store.dispatch(new HeaderActions.ToggleMenu(true));
    } else if (this.headerState.showMenu) {
      this.store.dispatch(new HeaderActions.ToggleMenu(false));
    }
    window.scrollTo(0, this.steps[stepCount]);
    this.stepCount = stepCount;
  }

  @HostListener('window:wheel', ['$event'])
  onWheelRotate(ev) {
    let delta, stepCount;
    if (!this.isMobile) {
      ev.preventDefault();
      if (!this.decounce) {
        if (ev.wheelDelta) {
          delta = ev.wheelDelta;
        } else {
          delta = -1 * ev.deltaY;
        }

        if (delta < 0) {
          stepCount = this.stepCount < 5 ? this.stepCount + 1 : 5;
          this.setStepCount(stepCount);
        } else {
          stepCount = this.stepCount > 0 ? this.stepCount - 1 : 0;
          this.setStepCount(stepCount);
        }

        this.decounce = true;
        setTimeout(() => {
          this.decounce = false;
        }, 1000);
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  onArrowUpDown(ev) {
    let stepCount, keycode = ev.keyCode;

    if (keycode === 40 && this.stepCount < 5) {
      ev.preventDefault();
      stepCount = this.stepCount + 1;
      this.setStepCount(stepCount);
    } else if (keycode === 38 && this.stepCount > 0) {
      ev.preventDefault();
      stepCount = this.stepCount - 1;
      this.setStepCount(stepCount);
    }
  }

  ngOnDestroy() {
  }
}
