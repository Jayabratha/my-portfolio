import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { AppStateService } from '../app-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './../common.styles.css']
})
export class HomeComponent implements OnDestroy {

  subscription: Subscription;
  restoreInitial: boolean = false;
  isHeaderFix: boolean = false;

  constructor(private appState: AppStateService) {
    //Set Header State to false to expand the header on load
    appState.setHeaderState(false);
    this.subscription = appState.getHeaderState().subscribe(
      (isHeaderFix : boolean) => {
        this.isHeaderFix = isHeaderFix;
        //Restore the state of the overview cards if the header is not fixed
        if (!isHeaderFix) {
          this.restoreInitial = true;
        }       
      });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
