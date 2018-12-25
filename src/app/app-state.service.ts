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

  setGalleryItem(currentItem): void {
    this.galleryItem.next(currentItem);
  }

  getGalleryItem(): Observable<Array<any>> {
    return this.galleryItem.asObservable();
  }

  setItemDimenion(itemElem): void {
    let elemDimension = itemElem.getBoundingClientRect();
    this.currentItemDimension = elemDimension;
  }

  getItemDimension(): any {
    return this.currentItemDimension;
  }

}
