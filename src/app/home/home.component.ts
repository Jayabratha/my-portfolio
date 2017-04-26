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

  constructor(private appState: AppStateService) {
    appState.setHeaderState(false);
    this.subscription = appState.getHeaderState().subscribe(
      (isHeaderFix : boolean) => {
        if (!isHeaderFix) {
          this.restoreInitial = true;
        }       
      });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
    console.log("Destroy");
  }
}
