import { Directive, ElementRef, OnInit, OnDestroy, HostListener, Renderer, EventEmitter, Output, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Directive({
  selector: '[appJsOnscroll]'
})
export class JsOnscrollDirective implements OnInit, OnDestroy {
  @Input() padding: number = 0;
  @Input() viewportCheck: boolean = false;
  @Input() activateScroll: boolean = true;
  @Input() restoreInitial: Subject<any>;
  @Input() checkAboveView: boolean = true;
  @Output() onStateChange = new EventEmitter<string>();
  @Output() enteredViewport = new EventEmitter<string>();

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
      console.log("Mobile device", deviceWidth);
    }

    this.elemViewportOffset = this.elem.getBoundingClientRect().top; 
    
    console.log(this.elemViewportOffset);

    if (this.restoreInitial) {
      this.restoreInitial.subscribe(event => {
        this.renderer.setElementClass(this.elem, 'below-view', true);
        this.hasEntered = false;
      });
    }

    if (this.viewportCheck) {
      this.renderer.setElementClass(this.elem, 'below-view', true);
      setTimeout(() => {
        this.checkAndUpdateClass();
      }, 850);
    }
  }

  checkAndUpdateClass = function () {
    let scrollPosition = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    console.log(scrollPosition);

    if (this.activateScroll) {
      if (this.viewportCheck) {
        this.renderer.setElementClass(this.elem, 'view-check', true);

        //Check if Below View
        if ((this.elem.offsetTop + this.padding) <= (window.pageYOffset + window.innerHeight)) {
          if (!this.hasEntered) {
            this.renderer.setElementClass(this.elem, 'below-view', false);
            this.hasEntered = true;
            this.enteredViewport.emit('entered');
          }
        } else {
          if (this.hasEntered) {
            this.renderer.setElementClass(this.elem, 'below-view', true);
            this.hasEntered = false;
          }
        }

        //Check if Above View
        if (this.checkAboveView) {
          if ((this.elem.offsetTop - 50) < window.pageYOffset) {
            if (!this.hasLeft) {
              this.renderer.setElementClass(this.elem, 'above-view', true);
              this.hasLeft = true;
            }
          } else {
            if (this.hasLeft) {
              this.renderer.setElementClass(this.elem, 'above-view', false);
              this.hasLeft = false;
              this.enteredViewport.emit('entered');
            }
          }
        }

      } if (scrollPosition > this.elemViewportOffset - this.padding) {
        console.log("Fix:", scrollPosition, this.elemViewportOffset - this.padding);
        this.onStateChange.emit('fix');
      } else {
        this.onStateChange.emit('scroll');
      }
    }
  }

  @HostListener('window:scroll') onScroll() {
    this.checkAndUpdateClass();
  }

  ngOnDestroy() {
    if (this.restoreInitial) {
      this.restoreInitial.unsubscribe();
    }
  }

}
