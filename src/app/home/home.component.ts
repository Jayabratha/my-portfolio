import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AppStateService } from '../app-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './../common.styles.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  isHeaderFix: boolean = false;
  steps: Array<number> = [0, 140, 640, 1140, 1670, 2170, 2670];
  stepCount: number = 0;
  decounce: boolean = false;
  isMobile: boolean = false;
  restoreInitial: Subject<any> = new Subject();

  constructor(private appState: AppStateService) {
  }

  ngOnInit() {
    let deviceWidth = window.screen.width;

    console.log("Device Width", deviceWidth);

    if (deviceWidth < 650) {
      this.isMobile = true;
      console.log("Mobile device", deviceWidth);
    }

    //Set Header State to false to expand the header on load
    this.appState.setHeaderState(false);
    this.subscription = this.appState.getHeaderState().subscribe(
      (isHeaderFix: boolean) => {
        this.isHeaderFix = isHeaderFix;
        //Restore the state of the overview cards if the header is not fixed
        if (!isHeaderFix) {
          setTimeout(() => {
            this.restoreInitial.next('restore');
          }, 200);
        }
      });
  }

  updateSlideCount(state: string, count: number) {
    this.stepCount = count;
  }

  @HostListener('window:wheel', ['$event'])
  onWheelRotate(ev) {
    let delta;
    if (!this.isMobile) {
      ev.preventDefault();
      if (!this.decounce) {
        if (ev.wheelDelta) {
          delta = ev.wheelDelta;
        } else {
          delta = -1 * ev.deltaY;
        }

        if (delta < 0) {
          this.stepCount = this.stepCount < 6 ? this.stepCount + 1 : 6;
          window.scrollTo(0, this.steps[this.stepCount]);
        } else {
          this.stepCount = this.stepCount > 0 ? this.stepCount - 1 : 0;
          window.scrollTo(0, this.steps[this.stepCount]);
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
    var keycode = ev.keyCode;
    if (keycode === 40) {
      ev.preventDefault();
      this.stepCount = this.stepCount < 6 ? this.stepCount + 1 : 6;
      window.scrollTo(0, this.steps[this.stepCount]);
    } else if (keycode === 38) {
      ev.preventDefault();
      this.stepCount = this.stepCount > 0 ? this.stepCount - 1 : 0;
      window.scrollTo(0, this.steps[this.stepCount]);
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
