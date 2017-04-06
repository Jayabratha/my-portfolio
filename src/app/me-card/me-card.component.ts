import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'me-card',
  templateUrl: './me-card.component.html',
  styleUrls: ['./me-card.component.css', './../common.styles.css']
})
export class MeCardComponent {
  @Output() onStateChange = new EventEmitter<string>();

  isInitial: boolean = true;
  showMenu: boolean = false;
  isHeaderFix : boolean;
  activeNav: string = "";

  slideList: Object[] = [{
    id: "slide1",
    url: "assets/images/my-pic.jpg",
    title: "My pic 1",
    alt: "My pic 1",
    description: ""
  },{
    id: "slide2",
    url: "assets/images/my-pic1.jpg",
    title: "My pic 2",
    alt: "My pic 2",
    description: ""
  },{
    id: "slide3",
    url: "assets/images/my-pic2.jpg",
    title: "My pic 3",
    alt: "My pic 3",
    description: ""
  },{
    id: "slide4",
    url: "assets/images/my-pic3.jpg",
    title: "My pic 4",
    alt: "My pic 4",
    description: ""
  },{
    id: "slide5",
    url: "assets/images/my-pic4.jpg",
    title: "My pic 5",
    alt: "My pic 5",
    description: ""
  }]

  constructor() {
    setTimeout(() => {
      this.isInitial = false;
    }, 2000);
  }

  headerStateChange(state: string) {
    if (state === 'fix') {
      this.isHeaderFix = true;
      this.onStateChange.emit('enable');
    } else if (state === 'scroll' && this.isHeaderFix) {
      this.isHeaderFix = false;
      this.onStateChange.emit('restore');
      console.log("Restore");
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
