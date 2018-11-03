import { Directive, ElementRef, OnInit, OnDestroy, HostListener, Renderer, EventEmitter, Output, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[appJsOnscroll]'
})
export class JsOnscrollDirective implements OnInit, OnDestroy {
  @Input() padding: number = 0;
  @Input() belowClass: string = 'below-view';
  @Input() aboveClass: string = 'above-view';
  @Input() viewportCheck: boolean = false;
  @Input() activateScroll: boolean = true;
  @Input() checkAboveView: boolean = true;
  @Output() onStateChange = new EventEmitter<string>();
  @Output() enteredViewport = new EventEmitter<string>();

  elem: HTMLElement;
  elemViewportOffset: number;
  hasEntered: boolean = false;
  hasLeft: boolean = false;
  isMobile: boolean = false;

  constructor(private renderer: Renderer, private el: ElementRef) {
    this.elem = this.el.nativeElement;
  }

  ngOnInit() {
    let deviceWidth = window.screen.width;

    if (deviceWidth < 650) {
      this.isMobile = true;
    }

    this.elemViewportOffset = this.elem.getBoundingClientRect().top;

    if (this.viewportCheck) {
      this.renderer.setElementClass(this.elem, this.belowClass, true);
      this.checkAndUpdateClass();
    }
  }

  checkAndUpdateClass = function () {
    let scrollPosition = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    if (this.activateScroll) {
      if (this.viewportCheck) {
        this.renderer.setElementClass(this.elem, 'view-check', true);

        setTimeout(() => {
          //Check if Below View
          if ((this.elem.offsetTop + this.padding) <= (window.pageYOffset + window.innerHeight)) {
            this.renderer.setElementClass(this.elem, this.belowClass, false);
            this.enteredViewport.emit(true);
          } else {
            this.renderer.setElementClass(this.elem, this.belowClass, true);
          }

          //Check if Above View
          if (this.checkAboveView) {
            if ((this.elem.offsetTop - 50) < window.pageYOffset) {
              this.renderer.setElementClass(this.elem, this.aboveClass, true);
            } else {
              this.renderer.setElementClass(this.elem, this.aboveClass, false);
            }
          }
        }, 500);

      } if (scrollPosition > this.elemViewportOffset - this.padding) {
        this.onStateChange.emit('fix');
      } else {
        this.onStateChange.emit('scroll');
      }
    }
  }

  @HostListener('window:scroll') onScroll() {
    this.checkAndUpdateClass();
  }

  ngOnDestroy() {
  }

}
