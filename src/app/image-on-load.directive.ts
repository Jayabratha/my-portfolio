import { Directive, ElementRef, Input, SimpleChanges, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appImageOnLoad]'
})
export class ImageOnLoadDirective implements OnChanges {
  @Input() imageItems;

  constructor(private renderer: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges) {
    let currentValue;
    for (let propName in changes) {
      let imageList = changes[propName].currentValue;

      if (imageList) {
        let i = 0;
        imageList.forEach((elem, index) => {
          this.renderer.addClass(elem.nativeElement, 'hide');
          elem.nativeElement.onload = () => {
            i++;
            console.log("Image Loaded: " + i);
            if (i === imageList.length) {
              console.log("All Image Loaded");
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
