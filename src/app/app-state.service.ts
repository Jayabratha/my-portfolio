import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AppStateService {
  private galleryList: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  private galleryItem: BehaviorSubject<any> = new BehaviorSubject<any>({});

  setGalleryList(galleryList):  void {
    this.galleryList.next(galleryList);
  }

  getGalleryList(): Observable<Array<any>> {
    return this.galleryList.asObservable();
  }

  setGalleryItem(currentItem):  void {
    this.galleryItem.next(currentItem);
  }

  getGalleryItem(): Observable<Array<any>> {
    return this.galleryItem.asObservable();
  }

}
