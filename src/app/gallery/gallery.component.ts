import { Component, OnInit, OnDestroy } from '@angular/core';
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
  showInfo: boolean = false;
  dimension: any;
  initialDimension: any;
  loadingGallery: boolean = true;
  centerImage: boolean = false;
  imageReady: boolean = false;

  ngOnInit() {
    this.listSubscription = this.appState.getGalleryList().subscribe((galleryList) => {
      if (galleryList.length) {
        this.galleryList = galleryList;
        this.showList = true;
        this.hideList();
        if (this.currentItemTitle) {
          this.checkForCurrentItem(this.galleryList, this.currentItemTitle);
        }
      }
    });

    this.initialDimension = this.appState.getItemDimension();

    if (this.initialDimension) {
      this.dimension = Object.assign({}, {
        top: this.initialDimension.top,
        bottom: this.initialDimension.bottom,
        left: this.initialDimension.left,
        right: this.initialDimension.right,
        height: this.initialDimension.height,
        width: this.initialDimension.width
      });
    } else {
      this.centerImage = true;
    }

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
          this.show = true;
          setTimeout(() => {
            let viewportHeight = document.documentElement.clientHeight;
            let viewportWidth = document.documentElement.clientWidth;
            let imageHeight = this.currentItem.height;

            this.dimension.height = (imageHeight < viewportHeight) ? imageHeight : viewportHeight;
            let imageWidth = (this.currentItem.width / imageHeight) * this.dimension.height;
            
            this.dimension.top = (imageHeight < viewportHeight) ? (viewportHeight - imageHeight)/2 : 0;
            this.dimension.left = (viewportWidth - imageWidth)/2;
          }, 50);
          setTimeout(() => {
            this.imageReady = true;
          }, 200);
          break;
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

  onLoadComplete() {
    this.loadingGallery = false;
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
    this.loadingGallery = true;
    this.appState.setGalleryItem(item);
    this.router.navigate(['/art/gallery/' + item.title]);
  }

  toggleShowInfo() {
    this.showInfo = !this.showInfo;
  }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
  }
}
