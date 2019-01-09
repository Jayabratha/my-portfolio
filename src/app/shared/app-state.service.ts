import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AppStateService {
  private galleryList: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  private galleryItem: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private currentItemDimension: any;

  setGalleryList(galleryList): void {
    this.galleryList.next(galleryList);
  }

  getGalleryList(): Observable<Array<any>> {
    return this.galleryList.asObservable();
  }

  setGalleryItem(currentItem, change?): void {
    if (change) {
      this.setItemDimenion(null);
    }
    this.galleryItem.next(currentItem);
  }

  getGalleryItem(): Observable<Array<any>> {
    return this.galleryItem.asObservable();
  }

  setItemDimenion(itemElem): void {
    if (itemElem) {
      let elemDimension = itemElem.getBoundingClientRect();
      this.currentItemDimension = elemDimension;
    } else {
      this.currentItemDimension = null;
    }  
  }

  getItemDimension(): any {
    return this.currentItemDimension;
  }

}
