import { Component, AfterViewInit, OnDestroy, ElementRef, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'me-card',
  templateUrl: './me-card.component.html',
  styleUrls: ['./me-card.component.css', './../common.styles.css']
})
export class MeCardComponent implements OnDestroy {
  @ViewChildren('navItem') navItems: QueryList<ElementRef>;

  isInitial: boolean = true;
  showMenu: boolean = false;
  isHeaderFix: boolean;
  activeNav: string = "";
  subscription: Subscription;
  activateScroll: boolean = true;
  play: boolean = true;
  carouselLoadProgress: number = 0;

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
  },{
    id: "slide1",
    url: "assets/images/my-pic.jpg",
    title: "My pic 1",
    alt: "My pic 1",
    description: ""
  }];

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

  constructor(private appState: AppStateService,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2) {

    this.subscription = appState.getHeaderState().subscribe(
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
          window.addEventListener("beforeunload", function (event) {
            renderer.setStyle(el.nativeElement, 'display', 'none');
            window.scrollTo(0, 0);
          });
        }
        
        if (event instanceof NavigationEnd) {
          //Scroll to top when route load
          window.scrollTo(0, 0);
        }
      });
  }

  onCarouselReady(isReady) {
    if(isReady) {
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
}
