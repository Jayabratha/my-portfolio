import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from './app-state.service';
import { ElasticsearchService } from './elasticsearch.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './common.styles.css'],
  providers: [AppStateService, ElasticsearchService]
})
export class AppComponent  implements OnInit, OnDestroy  {

  subscription: Subscription;
  isHeaderFix: boolean = false;

  constructor(private appState: AppStateService) {}

  ngOnInit() {
    this.subscription = this.appState.getHeaderState().subscribe(
      (isHeaderFix: boolean) => {
        this.isHeaderFix = isHeaderFix;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
