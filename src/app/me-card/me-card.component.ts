import { Component, OnDestroy } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'me-card',
  templateUrl: './me-card.component.html',
  styleUrls: ['./me-card.component.css', './../common.styles.css']
})
export class MeCardComponent implements OnDestroy {

  isInitial: boolean = true;
  showMenu: boolean = false;
  isHeaderFix: boolean;
  activeNav: string = "";
  subscription: Subscription;
  activateScroll: boolean = true;
  play: boolean = true;


  slideList: Object[] = [{
    id: "slide1",
    url: "assets/images/my-pic.jpg",
    title: "My pic 1",
    alt: "My pic 1",
    description: ""
  }, {
    id: "slide2",
    url: "assets/images/my-pic1.jpg",
    title: "My pic 2",
    alt: "My pic 2",
    description: ""
  }, {
    id: "slide3",
    url: "assets/images/my-pic2.jpg",
    title: "My pic 3",
    alt: "My pic 3",
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
  }]

  constructor(private appState: AppStateService, private router: Router) {
    this.subscription = appState.getHeaderState().subscribe(
      (isHeaderFix: boolean) => {
        this.isHeaderFix = isHeaderFix;
        if (isHeaderFix) {
          this.play = false;
        } else {
          this.play = true;
        }
        console.log("Header State Change");
      }
    );

    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          if (event.url === "/" || event.url === "/home") {
            this.activateScroll = true;
            setTimeout(() => {
              this.isInitial = false;
            }, 2000);
          } else {
            this.activateScroll = false;
            this.isInitial = false;
          }
          window.scrollTo(0, 0);
        }
      });


  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
    console.log("Destroy");
  }

  headerStateChange(state: string) {
    if (state === 'fix') {
      this.appState.setHeaderState(true);
    } else if (state === 'scroll' && this.isHeaderFix) {
      this.appState.setHeaderState(false);
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
