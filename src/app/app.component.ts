import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppStateService } from './app-state.service';
import { ElasticsearchService } from './elasticsearch.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './common.styles.css'],
  providers: [AppStateService, ElasticsearchService]
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private title: Title) {
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        (<any>window).gtag('config', 'UA-131214369-1', { 'page_path': event.urlAfterRedirects });

        switch (event.urlAfterRedirects) {
          case '/art':
            this.title.setTitle('Art | Collection of my artworks');
            break;
          case '/projects':
            this.title.setTitle('Projects | View my hobby projects');
            break;
          case '/blog':
            this.title.setTitle('Blog | My blog articles on technology and life');
            break;
          case '/about':
            this.title.setTitle('About | Learn more about me');
            break;
          case '/contact':
            this.title.setTitle('Contact | Connect with me on social network or reach out to me');
            break;
          default:
            this.title.setTitle('Jayabratha | My Portfolio | See my artworks, projects and blog')
        }
      }
    })
  }
}
