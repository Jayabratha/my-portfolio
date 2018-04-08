import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  QueryList,
  OnChanges,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appImageOnLoad]'
})
export class ImageOnLoadDirective implements OnChanges {
  @Input() imageItems: QueryList<ElementRef>;

  @Output() progress = new EventEmitter<number>();
  @Output() complete = new EventEmitter<boolean>();

  constructor(private renderer: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges) {
    let imageList, imagesCount, i = 0, progressPercentage;
    for (let propName in changes) {
      switch (propName) {
        case 'imageItems':
          imageList = changes[propName].currentValue;
          console.log(imageList);
          if (imageList) {
            imagesCount = imageList.length;
            imageList.forEach((elem, index) => {
              //Update progress on load of each image
              elem.nativeElement.onload = () => {
                i++;
                progressPercentage = (i / imagesCount) * 100;
                this.progress.emit(progressPercentage);

                if (i === imagesCount) {
                  this.complete.emit(true);
                }
              }
            });
          }
      }
    }
  }

}
