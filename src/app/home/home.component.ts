import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../app-store/app.state';
import { Header } from '../models/header.model';
import { HeaderState } from '../models/header-state.enum';
import * as HeaderActions from '../app-store/actions/header.actions';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './../app.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  HEADER_STATE = HeaderState;
  headerState: Header;
  screenWidth: number = window.innerHeight;
  steps: Array<{
    tileName: string,
    isAboveView: boolean,
    isBelowView: boolean
  }> = [{
    tileName: '',
    isAboveView: false,
    isBelowView: false
  }, {
    tileName: 'art-overview',
    isAboveView: false,
    isBelowView: false
  }, {
    tileName: 'projects-overview',
    isAboveView: false,
    isBelowView: false
  }, {
    tileName: 'blog-overview',
    isAboveView: false,
    isBelowView: false
  }, {
    tileName: 'about-overview',
    isAboveView: false,
    isBelowView: false
  }, {
    tileName: 'contact-overview',
    isAboveView: false,
    isBelowView: false
  }];
  stepCount: number = 0;
  decounce: boolean = false;
  isMobile: boolean = false;
  padding: number = 100;
  subs: Subscription;

  constructor(private store: Store<AppState>) { }

  private onDestroy$ = new Subject();

  ngOnInit() {
    let deviceWidth = window.screen.width;

    if (deviceWidth < 650) {
      this.isMobile = true;
    }

    this.subs = this.store.select('header')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((headerState: Header) => {
        this.headerState = headerState;
      });

    if (this.headerState.state === HeaderState.Fixed) {
      this.store.dispatch(new HeaderActions.UpdateState(HeaderState.Home))
    }

    if (!this.isMobile) {
      setTimeout(() => {
        this.store.dispatch(new HeaderActions.ToggleMenu(true));
      }, 500);
    }
  }

  setStepCount(stepCount) {
    let prevStepCount = this.stepCount;

    const nextScrollPosition = stepCount * (95 * this.screenWidth) / 100;

    if (stepCount) {
      //this.store.dispatch(new HeaderActions.ToggleMenu(false));
      // if (this.stepCount !== 0 && this.stepCount < stepCount) {
      //   this.steps[prevStepCount].isAboveView = true
      //   setTimeout(() => {
      //     window.scrollTo(0, nextScrollPosition);
      //     this.steps[prevStepCount].isAboveView = false;
      //   }, 500);
      // } else if (this.stepCount > stepCount) {
      //   this.steps[prevStepCount].isBelowView = true
      //   setTimeout(() => {
      //     window.scrollTo(0, nextScrollPosition);
      //     this.steps[prevStepCount].isBelowView = false;
      //   }, 500);
      // } else {
      //   window.scrollTo(0, nextScrollPosition);
      // }
    } else {
      
      this.store.dispatch(new HeaderActions.ToggleMenu(true));
      this.store.dispatch(new HeaderActions.UpdateState(HeaderState.Home));
    }

    window.scrollTo(0, nextScrollPosition);

    this.stepCount = stepCount;
  }

  @HostListener('window:wheel', ['$event'])
  onWheelRotate(ev) {
    let delta, stepCount;
    if (!this.isMobile) {
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
    let keycode = ev.code;

    if (keycode === "ArrowDown" && this.stepCount < 5) {
      ev.preventDefault();
      this.setStepCount(this.stepCount + 1);
    } else if (keycode === "ArrowUp" && this.stepCount > 0) {
      ev.preventDefault();
      this.setStepCount(this.stepCount - 1);
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
