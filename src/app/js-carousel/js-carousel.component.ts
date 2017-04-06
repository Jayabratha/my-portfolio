import { Component, Input, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-js-carousel',
  templateUrl: './js-carousel.component.html',
  styleUrls: ['./js-carousel.component.css']
})
export class JsCarouselComponent implements OnInit, OnDestroy {
  @Input() slideItems : { id: string,
                          url: string,
                          title: string,
                          alt: string,
                          description: string,
                          active: boolean,
                          left: boolean,
                          right: boolean,
                          next: boolean,
                          prev: boolean
                        }[];
  constructor(private elementRef: ElementRef) { }

  activeSlide;
  slideLength;
  carouselId;
  isPaused;

  ngOnInit() {
    this.slideLength = this.slideItems.length;
    this.activeSlide = this.slideItems[0];
    this.activeSlide.active = true;
    this.start();
  }

  ngOnDestroy() {
    if (this.carouselId) {
      clearInterval(this.carouselId);
    }
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.pause();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.start();
  }

  showNext() {
    this.slide('left');
  }

  showPrev() {
    this.slide('right');
  }

  getIndexOf(slide) {
    let i;
    for(i = 0; i < this.slideLength; i++) {
      let thisSlide = this.slideItems[i];
      if (thisSlide.id === slide.id) {
        return i;
      }
    }
  }

  getNextElement(direction, slide) {
    const activeElemIndex = this.getIndexOf(slide);
    const lastIndex = this.slideLength - 1;
    const delta = direction === 'right' ? -1 : 1;
    const itemIndex = (activeElemIndex + delta ) % this.slideLength;

    return itemIndex === -1 ? this.slideItems[lastIndex] : this.slideItems[itemIndex];
  }

  slide(direction) {
    let nextPrevClass = "";
    const nextSlide = this.getNextElement(direction, this.activeSlide);
    if (direction === 'left') {
      nextPrevClass = "next";
    } else {
      nextPrevClass = "prev";
    }
    nextSlide[nextPrevClass] = true;
    setTimeout(() => {
      this.activeSlide[direction] = true;
      nextSlide[direction] = true;
    }, 10);
    setTimeout(() => {
      this.activeSlide[direction] = false;
      nextSlide[direction] = false;
      nextSlide[nextPrevClass] = false;
      this.activeSlide["active"] = false;
      nextSlide["active"] = true;
      this.activeSlide = nextSlide;
    }, 810);
  }

  start() {
    this.isPaused = false;
    this.carouselId = setInterval(() => {
      this.showNext();
    }, 5000);
  }

  pause() {
    this.isPaused = true;
    clearInterval(this.carouselId);
  }

}
