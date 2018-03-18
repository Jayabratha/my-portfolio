import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {

  constructor(private appState: AppStateService) { }

  show: boolean = false;
  showList: boolean = false;
  listSubscription: Subscription;
  currentItemSubscribtion: Subscription;
  galleryList: Array<any> = [];
  galleryItem: any;
  isLoading: boolean = true;

  @ViewChildren('currentI') currentImg: QueryList<ElementRef>;;

  ngOnInit() {
    this.listSubscription = this.appState.getGalleryList().subscribe((galleryList) => {
      if (galleryList.length) {
        this.galleryList = galleryList;
        this.show = true;
        this.showList = true;
        this.hideList();
      }
    });

    this.currentItemSubscribtion = this.appState.getGalleryItem().subscribe((galleryItem) => {
      this.galleryItem = galleryItem;
      console.log(galleryItem);
    });

    if (!this.galleryItem) {
      this.galleryItem = this.galleryList[0];
    }

  }

  hideList() {
    setTimeout(() => {
      this.showList = false;
    }, 1500);
  }

  checkIfCurrentItem(item) {
    if (item && this.galleryItem && item.title === this.galleryItem.title) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
  }

  onLoadComplete() {
    console.log("Test");
    this.isLoading = false;
  }
}
