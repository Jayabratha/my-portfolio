import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { AngularFireStorage } from 'angularfire2/storage';

import { ElasticsearchService } from '../shared/elasticsearch.service';
import { SearchResult } from '../models/search-result.model';
import { NavItem } from '../models/nav-item.model';

import { Store } from '@ngrx/store';
import { AppState } from '../app-store/app.state';
import { Header } from '../models/header.model';
import { HeaderState } from '../models/header-state.enum';
import * as HeaderActions from '../app-store/actions/header.actions';
import { takeUntil } from 'rxjs/operators';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'me-card',
  templateUrl: './me-card.component.html',
  styleUrls: ['./me-card.component.css', './../app.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0', transform: 'translateY(-50px)' }),
        animate('.5s ease-out', style({ opacity: '1', transform: 'translateY(0)' })),
      ]),
    ])]
})
export class MeCardComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private storage: AngularFireStorage,
    private homeService: HomeService,
    private elasticsearch: ElasticsearchService) {
  }

  @ViewChildren('searchResult') searchResult: QueryList<ElementRef>;
  @ViewChild('mecard') meCard: ElementRef;

  private onDestory$ = new Subject();

  HEADER_STATE = HeaderState;
  header: Header;
  showMenu: boolean = false;
  showSearch: boolean = false;
  activeNav: string = "";
  subscription: Subscription;
  activateScroll: boolean = true;
  fixHeader: boolean = false;
  play: boolean = true;
  carouselLoadProgress: number = 0;
  carouselLoadStep: number = 0;
  nextLoad: number = 0;
  keyword: string = "";
  isMobile: boolean = false;
  isSearchAvailable: boolean = false;
  searchResults: Array<any> = [];
  resultsPage: boolean = false;
  loading: boolean = false;
  noResults: boolean = false;
  searchSubscription: Subscription;
  carouselProgressInterval: any;
  headerHeight: number = 0;
  meCarddHeight: number = 0;

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
    showText: false,
    applyBoxShadow: true
  }

  ngOnInit() {
    let deviceWidth = window.innerWidth;

    this.carouselLoadStep = (100 / this.slideList.length);
    this.nextLoad = this.carouselLoadProgress + this.carouselLoadStep;

    if (deviceWidth < 650) {
      this.isMobile = true;
    }

    this.store.select('header')
      .pipe(takeUntil(this.onDestory$))
      .subscribe((header: Header) => {
        this.header = header;
        this.showMenu = this.header.showMenu;
        this.showSearch = this.header.showSearch;

        if (this.showMenu) {
          this.animateNavItems();
        } else {
          this.hideNavItems();
        }
      });

    this.router.events
      .pipe(takeUntil(this.onDestory$))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          if (event.url === "/" || event.url === "/home") {
            this.activateScroll = true;
            this.fixHeader = false;
          } else {
            this.activateScroll = false;
            this.fixHeader = true;
          }
        }
      });

    //Check ElasticSearch Server
    this.elasticsearch.isAvailable()
      .pipe(takeUntil(this.onDestory$))
      .subscribe((response: any) => {
        if (response.ok && response._body !== 'elasticsearch cluster is down!') {
          this.isSearchAvailable = true;
        }
      });

    this.carouselProgressInterval = setInterval(() => {
      if (this.carouselLoadProgress < this.nextLoad) {
        this.carouselLoadProgress = this.carouselLoadProgress + 1;
      }
      if (this.carouselLoadProgress >= 100) {
        clearInterval(this.carouselProgressInterval);
        if (this.router.url === '/home' && this.header.state !== HeaderState.Fixed) {
          this.store.dispatch(new HeaderActions.UpdateState(this.HEADER_STATE.Home));
        }
      }
    }, 5);
  }

  scrollDown() {
    this.homeService.setSlideCount(1);
  }

  @HostListener('window:scroll') onScroll() {
    let scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    let scrollLimit = this.meCard.nativeElement.offsetHeight - 60;

    if (this.isMobile) {
      scrollLimit = (165 * window.innerWidth) / 100 - 360;
    }

    if (this.activateScroll && scrollTop < scrollLimit) {
      this.headerChange('scroll');
    } else {
      this.headerChange('fix');
    }
  }

  goToHome() {
    if (this.router.url !== '/home') {
      this.router.navigate(['/home']);
    } else {
      this.homeService.setSlideCount(0);
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

  onCarouselLoadProgress(progress) {
    // if (progress < 100) {
    //   this.nextLoad = this.carouselLoadProgress + this.carouselLoadStep;
    // } else {
    //   this.nextLoad = 100;
    // }
    this.nextLoad = 100;
  }

  headerChange(state: string) {
    if (state === 'fix' && this.header.state === this.HEADER_STATE.Home) {
      if (!this.isMobile) {
        this.store.dispatch(new HeaderActions.ToggleMenu(false));
      }
      this.store.dispatch(new HeaderActions.UpdateState(HeaderState.Fixed));
    } else if (state === 'scroll' && this.header.state === this.HEADER_STATE.Fixed) {
      if (!this.isMobile) {
        this.store.dispatch(new HeaderActions.ToggleMenu(true));
      }
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
    this.resultsPage = false;
    this.noResults = false;
    this.searchResults = [];
    this.keyword = "";
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.showSearch && this.header.state === HeaderState.Home) {
      this.store.dispatch(new HeaderActions.ToggleMenu(true));
    }
    if (!targetElem.classList.contains('search-result') && this.header.showSearch) {
      this.store.dispatch(new HeaderActions.ToggleSearch(false));
    }
  }

  search(keyword) {
    if (this.isSearchAvailable) {
      this.resultsPage = true;
      this.loading = true;
      this.searchSubscription = this.elasticsearch.search(keyword).subscribe((response) => {
        let resBody = response.json();
        this.searchResults.length = 0;
        if (resBody.hits.total.value > 0) {
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
          this.router.navigate(['/art/gallery/' + result.title]);
        }, 1000);
      }
    }
  }

  ngOnDestroy() {
    this.onDestory$.complete();
  }
}
