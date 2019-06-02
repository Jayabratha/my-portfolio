import { Component, ViewChildren, QueryList, ElementRef, Renderer2, OnInit } from '@angular/core';
import { FlamelinkService } from '../shared/flamelink.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css', './../app.component.css']
})
export class AboutComponent implements OnInit {
  @ViewChildren('skillItem') skillItems: QueryList<ElementRef>;

  experiences: Observable<any[]>;

  constructor(
    private renderer: Renderer2,
    private flService: FlamelinkService
  ) {
    this.flService.getContent("experience").subscribe((exps) => {
      this.experiences = exps.sort(this.compareByStartDate);
    });
  }

  compareByStartDate(a, b) {
    return parseInt(b.startDate.split(' ')[1], 10) - parseInt(a.startDate.split(' ')[1], 10);
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
