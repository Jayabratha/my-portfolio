import { Directive, ElementRef, HostListener, Renderer, EventEmitter, Output, Input } from '@angular/core';

@Directive({
  selector: '[appJsOnscroll]'
})
export class JsOnscrollDirective {
  @Input() padding: number = 0;
  @Input() viewportCheck: boolean = false;
  @Input() activateScroll: boolean = true;
  @Input() restoreInitial: boolean = false;
  @Output() onStateChange = new EventEmitter<string>();

  elem: HTMLElement;
  elemInitialOffset: number;
  elemViewportOffset: number;
  hasEntered: boolean = false;
  hasLeft: boolean = false;

  constructor(private renderer: Renderer, private el: ElementRef) {
    this.elem = this.el.nativeElement;
    this.elemInitialOffset = this.elem.offsetTop;
    this.elemViewportOffset = this.elem.getBoundingClientRect().top;
  }

  @HostListener('window:scroll') onScroll() {
    if (this.activateScroll) {
      if (this.viewportCheck) {
        if (this.restoreInitial) {
          this.renderer.setElementClass(this.elem, 'below-view', true);
          this.hasEntered = false;
        }
        if ((this.elem.offsetTop + this.padding) <= (window.pageYOffset + window.innerHeight) && !this.hasEntered) {
          this.renderer.setElementClass(this.elem, 'below-view', false);
          this.hasEntered = true;
        }
      } else if (document.body.scrollTop > this.elemViewportOffset - this.padding) {
        this.onStateChange.emit('fix');
      } else {
        this.onStateChange.emit('scroll');
      }
    }
  }
}
