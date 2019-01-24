import { Component, ViewChildren, QueryList, ElementRef, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css', './../app.component.css']
})
export class AboutComponent implements OnInit {
  @ViewChildren('skillItem') skillItems: QueryList<ElementRef>;

  constructor(
    private renderer: Renderer2) {
  }

  ngOnInit() {
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
