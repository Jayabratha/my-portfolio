import { Directive, ElementRef, OnInit, OnDestroy, HostListener, Renderer, EventEmitter, Output, Input } from '@angular/core';

@Directive({
  selector: '[appJsOnscroll]'
})
export class JsOnscrollDirective implements OnInit, OnDestroy {
  @Input() padding: number = 0;
  @Input() scrollLimit: number = 0;
  @Input() checkDelay: number = 500;
  @Input() belowClass: string = 'below-view';
  @Input() aboveClass: string = 'above-view';
  @Input() viewportCheck: boolean = false;
  @Input() activateScroll: boolean = true;
  @Input() checkAboveView: boolean = false;
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

    if (this.viewportCheck) {
      this.renderer.setElementClass(this.elem, 'view-check', true);
    }
    this.checkAndUpdateClass();
  }

  checkAndUpdateClass = function () {
    let scrollPosition = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    if (this.activateScroll) {
      if (this.viewportCheck) {
        setTimeout(() => {
          this.elemViewportOffset = this.elem.getBoundingClientRect().top;

          //Check if Below View
          if (this.elemViewportOffset > 0) {
            if ((this.elemViewportOffset + this.padding) <= window.innerHeight) {
              this.renderer.setElementClass(this.elem, this.belowClass, false);
              this.enteredViewport.emit(true);
            } else {
              this.renderer.setElementClass(this.elem, this.belowClass, true);
            }
          }        

          //Check if Above View
          if (this.checkAboveView) {
            if (this.elemViewportOffset + this.padding < 0) {
              this.renderer.setElementClass(this.elem, this.aboveClass, true);
            } else {
              this.renderer.setElementClass(this.elem, this.aboveClass, false);
            }
          }
        }, this.checkDelay);

      } if (scrollPosition > this.scrollLimit) {
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
