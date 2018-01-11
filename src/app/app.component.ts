import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from './app-state.service';
import { ElasticsearchService } from './elasticsearch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './common.styles.css'],
  providers: [AppStateService, ElasticsearchService]
})
export class AppComponent implements OnInit {

  ngOnInit() {

  }
}
