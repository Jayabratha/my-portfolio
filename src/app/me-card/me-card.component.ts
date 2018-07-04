import { Component, AfterViewInit, OnInit, OnDestroy, ElementRef, Renderer2, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { Subscription } from 'rxjs';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AngularFireStorage } from 'angularfire2/storage';
import { ElasticsearchService } from '../elasticsearch.service';
import { SearchResult } from '../models/search-result';

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
    private el: ElementRef,
    private renderer: Renderer2,
    private storage: AngularFireStorage,
    private elasticsearch: ElasticsearchService) {
  }

  @ViewChildren('navItem') navItems: QueryList<ElementRef>;
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
      console.log("Mobile device", deviceWidth);
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
      this.navItems.forEach((elem, index) => {
        setTimeout(() => {
          this.renderer.addClass(elem.nativeElement, 'show');
        }, index * 150);
      });
    }
  }

  hideNavItems() {
    if (this.navItems) {
      this.navItems.forEach((elem, index) => {
        setTimeout(() => {
          this.renderer.removeClass(elem.nativeElement, 'show');
        }, index * 150);
      });
    }
  }

  onCarouselReady(isReady) {
    if (isReady) {
      this.isInitial = false;
      //Animate the nav bar
      this.animateNavItems();
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
    } else if (state === 'scroll' && this.isHeaderFix) {
      console.log("Scrollable");
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
      this.hideNavItems();
    } else {
      this.keyword = "";
      this.searchResults = [];
      setTimeout(() => {
        this.animateNavItems();
      }, 500);
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
    if (this.router.url === '/home') {
      setTimeout(() => {
        this.animateNavItems();
      }, 500);
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
