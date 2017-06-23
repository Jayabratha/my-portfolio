import { Component, Input, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AppStateService } from '../app-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './../common.styles.css']
})
export class HomeComponent implements OnDestroy {

  subscription: Subscription;
  isHeaderFix: boolean = false;
  steps: Array<number> = [0, 140, 640, 1140, 1670, 2170, 2670];
  stepCount: number = 0;
  decounce: boolean = false;
  restoreInitial: Subject<any> = new Subject();

  constructor(private appState: AppStateService) {
    //Set Header State to false to expand the header on load
    appState.setHeaderState(false);
    this.subscription = appState.getHeaderState().subscribe(
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

  @HostListener('window:wheel', ['$event'])
  onWheelRotate(ev) {
    let delta;
    ev.preventDefault();
    if (!this.decounce) {
      if (ev.wheelDelta) {
        delta = ev.wheelDelta;
      } else {
        delta = -1 * ev.deltaY;
      }
      console.log(this.stepCount);
      if (delta < 0) {
        this.stepCount = this.stepCount < 6 ? this.stepCount + 1 : 6;
        console.log("DOWN: " + this.stepCount);
        window.scrollTo(0, this.steps[this.stepCount]);
      } else {
        this.stepCount = this.stepCount > 0 ? this.stepCount - 1 : 0;
        console.log("UP: " + this.steps[this.stepCount]);
        window.scrollTo(0, this.steps[this.stepCount]);
      }

      this.decounce = true;
      setTimeout(() => {
          this.decounce = false;
      }, 100);

    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
