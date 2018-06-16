import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppStateService } from '../app-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {

  constructor(private appState: AppStateService, private route: ActivatedRoute, private router: Router) { }

  show: boolean = false;
  showList: boolean = false;
  listSubscription: Subscription;
  currentItemSubscribtion: Subscription;
  galleryList: Array<any> = [];
  currentItem: any;
  currentItemTitle: string = "";
  currentItemIndex: number = 0;
  
  isLoading: boolean = true;

  ngOnInit() {
    this.listSubscription = this.appState.getGalleryList().subscribe((galleryList) => {
      if (galleryList.length) {
        this.galleryList = galleryList;
        this.show = true;
        this.showList = true;
        this.hideList();
        if (this.currentItemTitle) {
          this.checkForCurrentItem(this.galleryList, this.currentItemTitle);
        }
      }
    });

    this.route.params.subscribe(params => {
      this.currentItemTitle = params.title;
      if (this.galleryList.length) {
        this.checkForCurrentItem(this.galleryList, this.currentItemTitle);
      }
    });

    if (!this.currentItem) {
      this.currentItem = this.galleryList[0];
    }
  }

  checkForCurrentItem(itemList, itemTitle) {
    let i, galleryListLength = itemList.length;
      for (i = 0; i < galleryListLength; i++) {
        if (itemList[i].title === itemTitle) {
          this.currentItem = itemList[i];
          this.currentItemIndex = i;
        }
      }
  }

  hideList() {
    setTimeout(() => {
      this.showList = false;
    }, 1500);
  }

  checkIfCurrentItem(item) {
    if (item && this.currentItem && item.title === this.currentItem.title) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
  }

  onLoadComplete() {
    this.isLoading = false;
  }

  nextImage() {
    if (this.currentItemIndex === (this.galleryList.length - 1)) {
      this.currentItemIndex = 0;
    } else {
      this.currentItemIndex++;
    }
    let item = this.galleryList[this.currentItemIndex];
    this.changeImage(item);
  }

  prevImage() {
    if (this.currentItemIndex === 0) {
      this.currentItemIndex = this.galleryList.length - 1;
    } else {
      this.currentItemIndex--;
    }
    let item = this.galleryList[this.currentItemIndex];
    this.changeImage(item);
  }

  changeImage(item) {
    this.isLoading = true;
    this.appState.setGalleryItem(item);
    this.router.navigate(['/art/gallery/' + item.title]);
  }
}
