import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app-store/app.state';
import { UpdateCurrentItem, UpdateCurrentItemDimension } from '../app-store/actions/gallery.actions';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router) { }

  show: boolean = false;
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
  imageReady: boolean = false;

  ngOnInit() {
    this.store.select('gallery').subscribe(
      (gallery) => {
        if (gallery.galleryList.length) {
          this.galleryList = gallery.galleryList;
          this.initialDimension = gallery.currentItemDimension;
          if (this.currentItemTitle) {
            this.checkForCurrentItem(this.galleryList, this.currentItemTitle);
          }
        }
      }
    )

    this.route.params.subscribe(params => {
      this.currentItemTitle = params.title;

      if (this.initialDimension) {
        this.dimension = Object.assign({}, {
          top: this.initialDimension.top,
          bottom: this.initialDimension.bottom,
          left: this.initialDimension.left,
          right: this.initialDimension.right,
          height: this.initialDimension.height
        });
      } else {
        this.dimension = {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }
      }

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

        let viewportHeight = document.documentElement.clientHeight;
        let viewportWidth = document.documentElement.clientWidth;
        let imageHeight = this.currentItem.height;
        let imageWidth = this.currentItem.width;

        if (viewportWidth <= 650) {
          imageWidth = viewportWidth;
          imageHeight = (this.currentItem.height / this.currentItem.width) * imageWidth;
        } else {
          imageHeight = (imageHeight < viewportHeight) ? imageHeight : viewportHeight;
          imageWidth = (this.currentItem.width / this.currentItem.height) * imageHeight;
        }

        if (this.initialDimension) {
          setTimeout(() => {
            this.dimension.height = imageHeight;
            this.dimension.width = imageWidth;
            this.dimension.top = (imageHeight <= viewportHeight) ? (viewportHeight - imageHeight) / 2 : 0;
            this.dimension.left = (imageWidth <= viewportWidth) ? (viewportWidth - imageWidth) / 2 : 0;
          }, 50);
        } else {
          this.dimension.height = imageHeight;
          this.dimension.width = imageWidth;
          this.dimension.top = (imageHeight <= viewportHeight) ? (viewportHeight - imageHeight) / 2 : 0;
          this.dimension.left = (imageWidth <= viewportWidth) ? (viewportWidth - imageWidth) / 2 : 0;
        }
        setTimeout(() => {
          this.imageReady = true;
        }, 250);
        break;
      }
    }
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
    this.store.dispatch(new UpdateCurrentItemDimension(null));
    this.store.dispatch(new UpdateCurrentItem(item));  
    this.router.navigate(['/art/gallery/' + item.title]);
  }

  toggleShowInfo() {
    this.showInfo = !this.showInfo;
  }

  closeGallery() {
    this.imageReady = false;
    this.show = false;
    if (this.initialDimension) {
      setTimeout(() => {
        this.dimension = Object.assign({}, {
          top: this.initialDimension.top,
          bottom: this.initialDimension.bottom,
          left: this.initialDimension.left,
          right: this.initialDimension.right,
          height: this.initialDimension.height
        });
      }, 10);
      setTimeout(() => {
        this.router.navigate(['/art']);
      }, 200);
    } else {
      this.router.navigate(['/art']);
    }
  }

  ngOnDestroy() {
    //this.listSubscription.unsubscribe();
  }
}
