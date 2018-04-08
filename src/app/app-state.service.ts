import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppStateService {
  private galleryList: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  private galleryItem: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private headerSubject: Subject<boolean> = new Subject<boolean>();

  setHeaderState(isFix: boolean): void {
    this.headerSubject.next(isFix);
  }

  getHeaderState(): Observable<boolean> {
    return this.headerSubject.asObservable();
  }

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
