import { Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
  selector: '[clickedOut]'
})
export class ClickedOutDirective {

  constructor(private elemRef: ElementRef) { }

  @Output()
  public clickedOut = new EventEmitter();

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event, targetElement) {
      const clickedInside = this.elemRef.nativeElement.contains(targetElement);
      if (!clickedInside) {
          this.clickedOut.emit(targetElement);
      }
      event.stopPropagation();
  }

}
