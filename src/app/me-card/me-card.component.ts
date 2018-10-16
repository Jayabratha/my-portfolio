import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { Subscription } from 'rxjs';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AngularFireStorage } from 'angularfire2/storage';
import { Store } from '@ngrx/store';
import * as HeaderActions from '../actions/header.actions';

import { ElasticsearchService } from '../elasticsearch.service';
import { SearchResult } from '../models/search-result.model';
import { NavItem } from '../models/nav-item.model';
import { AppState } from '../app.state';
import { HeaderState } from '../models/header-state.enum';

@Component({
  selector: 'me-card',
  templateUrl: './me-card.component.html',
  styleUrls: ['./me-card.component.css', './../common.styles.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0', transform: 'translateY(-50px)' }),
        animate('.5s ease-out', style({ opacity: '1', transform: 'translateY(0)' })),
      ]),
    ])]
})
export class MeCardComponent implements OnInit, OnDestroy {

  constructor(private appState: AppStateService,
    private router: Router,
    private store: Store<AppState>,
    private storage: AngularFireStorage,
    private elasticsearch: ElasticsearchService) {
  }

  @ViewChildren('searchResult') searchResult: QueryList<ElementRef>;
  @ViewChild('searchInput') searchInput: ElementRef;

  isInitial: boolean = true;
  showMenu: boolean = false;
  showSearch: boolean = false;
  isHeaderFix: boolean;
  activeNav: string = "";
  subscription: Subscription;
  activateScroll: boolean = true;
  play: boolean = true;
  carouselLoadProgress: number = 0;
  keyword: string = "";
  isMobile: boolean = false;
  requiredPadding: number = 60;
  isSearchAvailable: boolean = false;
  searchResults: Array<any> = [];
  resultsPage: boolean = false;
  loading: boolean = false;
  navItems: Array<NavItem> = [
    new NavItem('art', 'Art', '/art', false),
    new NavItem('projects', 'Projects', '/projects', false),
    new NavItem('blog', 'Blog', '/blog', false),
    new NavItem('about', 'About', '/about', false),
    new NavItem('contact', 'Contact', '/contact', false)
  ];

  slideList: Object[] = [{
    id: "slide2",
    url: "assets/images/my-pic1.jpg",
    title: "My pic 2",
    alt: "My pic 2",
    description: ""
  }, {
    id: "slide4",
    url: "assets/images/my-pic3.jpg",
    title: "My pic 4",
    alt: "My pic 4",
    description: ""
  }, {
    id: "slide5",
    url: "assets/images/my-pic4.jpg",
    title: "My pic 5",
    alt: "My pic 5",
    description: ""
  }, {
    id: "slide1",
    url: "assets/images/my-pic.jpg",
    title: "My pic 1",
    alt: "My pic 1",
    description: ""
  }];

  ngOnInit() {
    let deviceWidth = window.screen.width;

    if (deviceWidth < 650) {
      this.isMobile = true;
      this.requiredPadding = -320;
    }

    this.subscription = this.appState.getHeaderState().subscribe(
      (isHeaderFix: boolean) => {
        this.isHeaderFix = isHeaderFix;
      
        if (isHeaderFix) {
          this.play = false;
          this.hideNavItems();       
        } else {
          this.play = true;
          if (!this.isInitial) {
            this.animateNavItems();
          }
        }
      }
    );

    //Check ElasticSearch Server
    this.elasticsearch.isAvailable().subscribe(response => {
      if (response.ok) {
        this.isSearchAvailable = true;
      }
    });

    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          if (event.url === "/" || event.url === "/home") {
            this.activateScroll = true;
          } else {
            this.activateScroll = false;
            this.isInitial = false;
          }
          // Prevent auto position of scroll on page refresh instead keep on top
          window.addEventListener("beforeunload", (event) => {
            window.scrollTo(0, 0);
          });
        }

        if (event instanceof NavigationEnd) {
          //Scroll to top when route load
          window.scrollTo(0, 0);
        }
      });

  }

  animateNavItems() {
    if (this.navItems) {
      this.navItems.forEach((navItem, index) => {
        setTimeout(() => {
          navItem.visible = true;
        }, index * 150);
      });
    }
  }

  hideNavItems() {
    if (this.navItems) {
      this.navItems.forEach((navItem, index) => {
        setTimeout(() => {
          navItem.visible = false;
        }, index * 150);
      });
    }
  }

  onCarouselReady(isReady) {
    if (isReady) {
      this.isInitial = false;
      //Animate the nav bar
      if (!this.isMobile && this.router.url === '/home') {
        this.animateNavItems();
      }    
    }
  }

  onCarouselLoadProgress(progress) {
    this.carouselLoadProgress = progress;
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  headerStateChange(state: string) {
    if (state === 'fix') {
      this.appState.setHeaderState(true);
      this.store.dispatch(new HeaderActions.UpdateState(HeaderState.Fixed));
    } else if (state === 'scroll' && this.isHeaderFix) {
      this.appState.setHeaderState(false);
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    if (this.showMenu) {
      this.animateNavItems();
    } else {
      this.hideNavItems();
    }
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      this.play = false;
      this.resultsPage = false;
      this.searchInput.nativeElement.focus();
    } else {
      this.keyword = "";
      this.searchResults = [];
    }
  }

  hideMenu() {
    this.showMenu = false;
  }

  hideSearch(targetElem) {
    if (!targetElem.classList.contains('search-result')) {
      this.showSearch = false;
      this.searchResults = [];
      this.keyword = "";
    }
  }

  search(keyword) {
    this.resultsPage = true;
    this.loading = true;
    if (this.isSearchAvailable) {
      this.elasticsearch.search(keyword).subscribe((response) => {
        let resBody = response.json();
        this.searchResults.length = 0;
        if (resBody.hits.total > 0) {
          resBody.hits.hits.forEach(result => {
            if (result._index === "images") {
              this.storage.ref(result._source.thumbPath).getDownloadURL().subscribe((thumbUrl) => {
                this.loading = false;
                this.searchResults.push(new SearchResult(result._source.title, 'art', thumbUrl, result._source.desc, result._source));
              });
            }
          });
        }
      });
    }
  }

  selectResult(result) {
    this.searchResults = [];
    switch (result.type) {
      case 'art': {
        this.router.navigate(['/art']);
        setTimeout(() => {
          this.router.navigate(['/art/gallery/' + result.name]);
        }, 1000);
      }
    }
  }
}
