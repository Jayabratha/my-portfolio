import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
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
  steps: Array<{
    tileName: string,
    scrollPosition: number,
    isAboveView: boolean,
    isBelowView: boolean
  }> = [{
    tileName: '',
    scrollPosition: 0,
    isAboveView: false,
    isBelowView: false
  }, {
    tileName: 'art-overview',
    scrollPosition: 140,
    isAboveView: false,
    isBelowView: false
  }, {
    tileName: 'projects-overview',
    scrollPosition: 940,
    isAboveView: false,
    isBelowView: false
  }, {
    tileName: 'blog-overview',
    scrollPosition: 1740,
    isAboveView: false,
    isBelowView: false
  }, {
    tileName: 'about-overview',
    scrollPosition: 2540,
    isAboveView: false,
    isBelowView: false
  }, {
    tileName: 'contact-overview',
    scrollPosition: 3340,
    isAboveView: false,
    isBelowView: false
  }];
  stepCount: number = 0;
  decounce: boolean = false;
  isMobile: boolean = false;

  constructor(
    private store: Store<AppState>,
    private router: Router) {
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

  setStepCount(stepCount) {
    let prevStepCount = this.stepCount;

    if (this.stepCount !== 0 && this.stepCount < stepCount) {
      this.steps[prevStepCount].isAboveView = true
      setTimeout(() => {
        window.scrollTo(0, this.steps[stepCount].scrollPosition);
        this.steps[prevStepCount].isAboveView = false;
       }, 500);
    } else if (this.stepCount !== 1 && this.stepCount > stepCount) {
      this.steps[prevStepCount].isBelowView = true
      setTimeout(() => {
        window.scrollTo(0, this.steps[stepCount].scrollPosition);
        this.steps[prevStepCount].isBelowView = false;
       }, 500);
      setTimeout(() => { window.scrollTo(0, this.steps[stepCount].scrollPosition) }, 500);
    } else {
      window.scrollTo(0, this.steps[stepCount].scrollPosition);
    }

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
    let keycode = ev.keyCode;

    if (keycode === 40 && this.stepCount < 5) {
      ev.preventDefault();
      this.setStepCount(this.stepCount + 1);
    } else if (keycode === 38 && this.stepCount > 0) {
      ev.preventDefault();
      this.setStepCount(this.stepCount - 1);
    }
  }

  ngOnDestroy() {
  }
}
