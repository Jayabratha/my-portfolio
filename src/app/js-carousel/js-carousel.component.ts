import { Component, Input, SimpleChanges, OnChanges, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-js-carousel',
  templateUrl: './js-carousel.component.html',
  styleUrls: ['./js-carousel.component.css']
})
export class JsCarouselComponent implements OnChanges, OnInit, OnDestroy {
  @Input() play: boolean = true;
  @Input() slideItems: {
    id: string,
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

  ngOnChanges(changes: SimpleChanges) {
    let currentValue;
    for (let propName in changes) {
      if (propName === 'play') {
        currentValue = changes[propName].currentValue;
        if (currentValue) {
          this.start();
        } else {
          this.pause();
        }
      }
    }
  }

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
    for (i = 0; i < this.slideLength; i++) {
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
    const itemIndex = (activeElemIndex + delta) % this.slideLength;

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
    //Clear if a interval is set
    if (this.carouselId) {
      clearInterval(this.carouselId);
    }
    //Start a new Carousel
    this.carouselId = setInterval(() => {
      this.showNext();
    }, 5000);
  }

  pause() {
    clearInterval(this.carouselId);
  }

}
