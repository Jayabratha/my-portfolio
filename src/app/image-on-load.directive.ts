import { Directive, ElementRef, Input, SimpleChanges, QueryList, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appImageOnLoad]'
})
export class ImageOnLoadDirective implements OnChanges {
  @Input() imageItems: QueryList<ElementRef>;

  constructor(private renderer: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let imageList = changes[propName].currentValue;

      if (imageList) {
        let i = 0;
        imageList.forEach((elem, index) => {
          this.renderer.addClass(elem.nativeElement, 'hide');
          elem.nativeElement.onload = () => {
            i++;
            if (i === imageList.length) {
              setTimeout(() => {
                imageList.forEach((elem, index) => {
                  setTimeout(() => {
                    this.renderer.removeClass(elem.nativeElement, 'hide');
                  }, index * 200);
                });
              }, 800);
            }
          }
        });
      }
    }
  }

}
