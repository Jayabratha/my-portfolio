import { Component, Input, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-js-carousel',
  templateUrl: './js-carousel.component.html',
  styleUrls: ['./js-carousel.component.css']
})
export class JsCarouselComponent implements OnInit, OnDestroy {
  @Input() slideCount : number = 0;
  constructor(private elementRef: ElementRef) { }

  el;
  slideArray;
  slideLength;
  carouselId;
  isPaused;

  ngOnInit() {
    this.el = this.elementRef.nativeElement;
    this.slideArray = this.el.querySelectorAll('.carousel-item');
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

  getIndexOf(element) {
    let i;
    this.slideLength = this.slideArray.length;

    for(i = 0; i < this.slideLength; i++) {
      let slideElem = this.slideArray[i];
      if (slideElem.id === element.id) {
        return i;
      }
    }
  }

  getNextElement(direction, activeElement) {
    const activeElemIndex = this.getIndexOf(activeElement);
    const lastIndex = this.slideLength - 1;
    const delta = direction === 'right' ? -1 : 1;
    const itemIndex = ( activeElemIndex + delta ) % this.slideLength;

    return itemIndex === -1 ? this.slideArray[lastIndex] : this.slideArray[itemIndex];
  }

  slide(direction) {
    let nextPrevClass = "";
    const activeElement = this.el.querySelector('.active');
    const nextElement = this.getNextElement(direction, activeElement);
    if (direction === 'left') {
      nextPrevClass = "next";
    } else {
      nextPrevClass = "prev";
    }
    nextElement.classList.add(nextPrevClass);
    setTimeout(() => {
      activeElement.classList.add(direction);
      nextElement.classList.add(direction);
    }, 10);
    setTimeout(() => {
      activeElement.classList.remove(direction);
      nextElement.classList.remove(direction);
      nextElement.classList.remove(nextPrevClass);
      activeElement.classList.remove("active");
      nextElement.classList.add("active");
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
