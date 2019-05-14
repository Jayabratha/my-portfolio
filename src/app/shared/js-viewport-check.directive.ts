import { Directive, ElementRef, OnInit, OnDestroy, HostListener, Renderer, EventEmitter, Output, Input } from '@angular/core';

@Directive({
  selector: '[viewportCheck]'
})
export class ViewportCheck implements OnInit, OnDestroy {
  @Input() padding: number = 0;
  @Input() scrollLimit: number = 0;
  @Input() checkDelay: number = 500;
  @Input() belowClass: string = 'below-view';
  @Input() aboveClass: string = 'above-view';
  @Input() noDecorate: boolean = false;
  @Input() checkAboveView: boolean = false;
  @Output() enteredViewport = new EventEmitter<string>();
  @Output() leftViewport = new EventEmitter<string>();

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

    this.renderer.setElementClass(this.elem, 'view-check', true);
    this.checkAndUpdateClass();
  }

  checkAndUpdateClass = function () {
    setTimeout(() => {
      this.elemViewportOffset = this.elem.getBoundingClientRect().top;

      //Check if Below View
      if (this.elemViewportOffset > 0) {
        if ((this.elemViewportOffset + this.padding) <= window.innerHeight) {
          if (!this.noDecorate) {
            this.renderer.setElementClass(this.elem, this.belowClass, false);
          }
          if (!this.hasEntered) {
            this.hasEntered = true;
            this.enteredViewport.emit(true);
          }
        } else {
          if (!this.noDecorate) {
            this.renderer.setElementClass(this.elem, this.belowClass, true);
          }
          if (this.hasEntered) {
            this.hasEntered = false;
            this.leftViewport.emit(true);
          }
        }
      }

      //Check if Above View
      if (this.checkAboveView && !this.noDecorate) {
        if (this.elemViewportOffset + this.padding < 0) {
          this.renderer.setElementClass(this.elem, this.aboveClass, true);
        } else {
          this.renderer.setElementClass(this.elem, this.aboveClass, false);
        }
      }
    }, this.checkDelay);
  }

  @HostListener('window:scroll') onScroll() {
    this.checkAndUpdateClass();
  }

  ngOnDestroy() {
  }

}
