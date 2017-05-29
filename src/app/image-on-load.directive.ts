import { Directive, ElementRef, Input, SimpleChanges, QueryList, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appImageOnLoad]'
})
export class ImageOnLoadDirective implements OnChanges {
  @Input() imageItems: QueryList<ElementRef>;
  @Input() loaderItems: QueryList<ElementRef>;
  @Input() loadingClass: string;

  constructor(private renderer: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges) {
    let imageList, loaderList;
    for (let propName in changes) {
      switch (propName) {
        case 'imageItems':
          imageList = changes[propName].currentValue;
          if (imageList) {
            let i = 0;
            imageList.forEach((elem, index) => {
              this.renderer.addClass(elem.nativeElement, 'hide');
              elem.nativeElement.onload = () => {
                i++;
                if (i === imageList.length) {
                  setTimeout(() => {
                    loaderList.forEach((elem, index) => {
                      this.renderer.removeClass(elem.nativeElement, this.loadingClass);
                    });
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
          break;
        case 'loaderItems':
          loaderList = changes[propName].currentValue;
          if (loaderList) {
            loaderList.forEach((elem, index) => {
              this.renderer.addClass(elem.nativeElement, this.loadingClass);
            });
          }
          break;
      }
    }
  }

}
