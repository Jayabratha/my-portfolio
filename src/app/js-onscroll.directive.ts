import { Directive, ElementRef, HostListener, Renderer, EventEmitter, Output, Input } from '@angular/core';

@Directive({
  selector: '[appJsOnscroll]'
})
export class JsOnscrollDirective {
  @Input() padding: number = 0;
  @Input() viewportCheck: boolean = false;
  @Output() onStateChange = new EventEmitter<string>();

  elem: HTMLElement;
  elemInitialOffset: number;
  hasEntered: boolean = false;
  hasLeft: boolean = false;

  constructor(private renderer: Renderer, private el: ElementRef) { 
    this.elem = this.el.nativeElement;
    this.elemInitialOffset = this.elem.offsetTop;
  }

  @HostListener('window:scroll') onScroll() {
    if (this.viewportCheck) {
      if ((this.elem.offsetTop + this.padding) <= (window.pageYOffset + window.innerHeight) && !this.hasEntered) {
        this.renderer.setElementClass(this.elem, 'below-view', false);
        this.hasEntered = true;
      }
      // if ((this.elem.offsetTop + this.elem.offsetHeight - this.padding) <= document.body.scrollTop && !this.hasLeft) {
      //   this.renderer.setElementClass(this.elem, 'above-view', true);
      //   this.hasLeft = true;
      //   console.log("left");
      // } else {
      //   this.renderer.setElementClass(this.elem, 'above-view', false);
      // }
    } else if (document.body.scrollTop > this.elemInitialOffset - this.padding ) {
      this.onStateChange.emit('fix');
    }  else {
      this.onStateChange.emit('scroll');
    } 
  }
}
