import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from './app-state.service';
import { ElasticsearchService } from './elasticsearch.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import { Header } from './models/header.model';
import { HeaderState } from './models/header-state.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './common.styles.css'],
  providers: [AppStateService, ElasticsearchService]
})
export class AppComponent implements OnInit {

  subscription: Subscription;
  isHeaderFix: boolean = false;
  headerState: Header;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.select('header').subscribe((headerState: Header) => {
      this.headerState = headerState;
      console.log(this.headerState);
    })
  }
}
