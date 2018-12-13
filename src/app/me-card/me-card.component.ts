import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { Subscription } from 'rxjs';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { AngularFireStorage } from 'angularfire2/storage';

import { ElasticsearchService } from '../elasticsearch.service';
import { SearchResult } from '../models/search-result.model';
import { NavItem } from '../models/nav-item.model';

import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { Header } from '../models/header.model';
import { HeaderState } from '../models/header-state.enum';
import * as HeaderActions from '../actions/header.actions';

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

  HEADER_STATE = HeaderState;
  headerState: Header;
  showMenu: boolean = false;
  showSearch: boolean = false;
  activeNav: string = "";
  subscription: Subscription;
  activateScroll: boolean = true;
  play: boolean = true;
  carouselLoadProgress: number = 0;
  keyword: string = "";
  isMobile: boolean = false;
  isSearchAvailable: boolean = false;
  searchResults: Array<any> = [];
  resultsPage: boolean = false;
  loading: boolean = false;
  noResults: boolean = false;
  searchSubscription: Subscription;

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
    url: "assets/images/my-pic2.jpg",
    title: "My pic 4",
    alt: "My pic 4",
    description: ""
  }, {
    id: "slide5",
    url: "assets/images/my-pic3.jpg",
    title: "My pic 5",
    alt: "My pic 5",
    description: ""
  }];

  carouselConfig = {
    slideInterval: 5000,  
    leftArrowClassName: 'icon-ios-arrow-thin-left',
    rightArrowClassName: 'icon-ios-arrow-thin-right',
    showText: false
  }

  ngOnInit() {
    let deviceWidth = window.screen.width;

    if (deviceWidth < 650) {
      this.isMobile = true;
    }

    this.store.select('header').subscribe((headerState: Header) => {
      this.headerState = headerState;
      this.showMenu = this.headerState.showMenu;
      this.showSearch = this.headerState.showSearch;

      if (this.showMenu) {
        this.animateNavItems();
      } else {
        this.hideNavItems();
      }

      if (this.showSearch) {
        this.play = false;
        this.resultsPage = false;
        this.searchInput.nativeElement.focus();
      } else {
        this.keyword = "";
        this.searchResults = [];
      }
    });

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

  goToHome() {
    if (this.router.url !== '/home') {
      this.router.navigate(['/home']);
    } else {
      window.scrollTo(0, 0);
      this.store.dispatch(new HeaderActions.ToggleMenu(true));
    }
  }

  animateNavItems() {
    this.navItems.forEach((navItem, index) => {
      setTimeout(() => {
        navItem.visible = true;
      }, (index + 1) * 150);
    });
  }

  hideNavItems() {
    this.navItems.forEach((navItem, index) => {
      setTimeout(() => {
        navItem.visible = false;
      }, (index + 1) * 150);
    });
  }

  onCarouselReady(isReady) {
    if (isReady) {
      setTimeout(() => {
        if (this.router.url === '/home' && this.headerState.state !== HeaderState.Fixed) {
          this.store.dispatch(new HeaderActions.UpdateState(HeaderState.Home));
        }
      }, 1000);
    }
  }

  onCarouselLoadProgress(progress) {
    this.carouselLoadProgress = progress;
  }

  headerStateChange(state: string) {
    console.log(state);
    if (state === 'fix' && this.headerState.state === this.HEADER_STATE.Home) {
      this.store.dispatch(new HeaderActions.UpdateState(HeaderState.Fixed));
    } else if (state === 'scroll' && this.headerState.state === this.HEADER_STATE.Fixed) {
      this.store.dispatch(new HeaderActions.UpdateState(HeaderState.Home));
    }
  }

  toggleMenu() {
    this.store.dispatch(new HeaderActions.ToggleMenu(!this.showMenu));
  }

  toggleSearch() {
    if (this.showMenu) {
      this.hideMenu();
    }  
    this.store.dispatch(new HeaderActions.ToggleSearch(!this.showSearch));
  }

  hideMenu() {
    this.store.dispatch(new HeaderActions.ToggleMenu(false));
  }

  hideSearch(targetElem) {
    this.loading = false;
    this.noResults = false;
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }   
    if (this.showSearch && this.headerState.state === HeaderState.Home) {
      this.store.dispatch(new HeaderActions.ToggleMenu(true));
    }
    if (!targetElem.classList.contains('search-result') && this.headerState.showSearch) {
      this.store.dispatch(new HeaderActions.ToggleSearch(false));
    }
  }

  search(keyword) {
    this.resultsPage = true;
    this.loading = true;
    if (this.isSearchAvailable) {
      this.searchSubscription = this.elasticsearch.search(keyword).subscribe((response) => {
        let resBody = response.json();
        this.searchResults.length = 0;
        if (resBody.hits.total > 0) {
          this.noResults = false;
          resBody.hits.hits.forEach(result => {
            if (result._index === "images") {
              this.storage.ref(result._source.thumbPath).getDownloadURL().subscribe((thumbUrl) => {
                this.loading = false;
                this.searchResults.push(new SearchResult(result._source.title, 'art', thumbUrl, result._source.desc, result._source));
              });
            }
          });
        } else {
          this.loading = false;
          this.noResults = true;
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

  ngOnDestroy() {
  }
}
