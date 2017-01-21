import { Directive, ElementRef, HostListener, HostBinding, EventEmitter, Output, Input } from '@angular/core';

@Directive({
  selector: '[appJsOnscroll]'
})
export class JsOnscrollDirective {
  @Input() padding: number = 0;
  @Output() onStateChange = new EventEmitter<string>();

  elemOffsetTop: number;
  constructor(private el: ElementRef) { 
    this.elemOffsetTop = this.el.nativeElement.offsetTop;
    console.log(this.elemOffsetTop);
  }

  @HostListener('window:scroll') onScroll() {
    if (document.body.scrollTop > this.elemOffsetTop - this.padding ) {
      this.onStateChange.emit('fix');
    }  else {
      this.onStateChange.emit('scroll');
    } 
  }
}
