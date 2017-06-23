import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { routeAnimation } from '../animations/animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css', './../app.component.css', './../common.styles.css'],
  animations: [routeAnimation()],
  host: { '[@routeAnimation]': '' }
})
export class AboutComponent implements AfterViewInit {
  @ViewChildren('navItem') navItems: QueryList<ElementRef>;

  constructor(private appState: AppStateService, private renderer: Renderer2) {
    this.appState.setHeaderState(true);
  }

  ngAfterViewInit() {
    if (this.navItems) {
      setTimeout(() => {
        this.navItems.forEach((elem, index) => {
          setTimeout(() => {
            this.renderer.addClass(elem.nativeElement, 'show');
          }, index * 150);
        });      
      }, 1000);
    }
  }

}
