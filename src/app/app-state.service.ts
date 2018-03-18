import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppStateService {
  // private isHeaderFix: boolean = false;
  private galleryList: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  private galleryItem: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private headerSubject: Subject<boolean> = new Subject<boolean>();

  setHeaderState(isFix: boolean): void {
    //this.isHeaderFix = isFix;
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
    console.log(currentItem);
  }

  getGalleryItem(): Observable<Array<any>> {
    return this.galleryItem.asObservable();
  }

}
