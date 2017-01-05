import { Directive, ElementRef, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appJsOnscroll]'
})
export class JsOnscrollDirective {
  elemOffsetTop: Number;
  constructor(private el: ElementRef) { 
    this.elemOffsetTop = this.el.nativeElement.offsetTop;
  }

  @HostBinding('class.fix-header') fixIt
  @HostListener('window:scroll') onScroll() {
   // console.log("offsetTop: " + this.elemOffsetTop + ", scrollTop: " + document.body.scrollTop);
    if (document.body.scrollTop > this.elemOffsetTop ) {
      this.fixIt = true;
    }  else {
      this.fixIt = false;
    } 
  }
}
