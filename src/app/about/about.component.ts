import { Component, ViewChildren, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { routeAnimation } from '../animations/animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css', './../app.component.css', './../common.styles.css'],
  animations: [routeAnimation()],
  host: { '[@routeAnimation]': '' }
})
export class AboutComponent {
  @ViewChildren('skillItem') skillItems: QueryList<ElementRef>;

  constructor(private appState: AppStateService, private renderer: Renderer2) {
    this.appState.setHeaderState(true);
  }

  animateSkills() {
    if (this.skillItems) {
      setTimeout(() => {
        this.skillItems.forEach((elem, index) => {
          setTimeout(() => {
            this.renderer.removeClass(elem.nativeElement, 'hide');
          }, index * 150);
        });      
      }, 500);
    }
  }

}
