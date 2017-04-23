import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppStateService {
  private isHeaderFix: boolean = false;
  private headerSubject: Subject<boolean> = new Subject<boolean>();

  setHeaderState(isFix: boolean): void {
    this.isHeaderFix = isFix;
    this.headerSubject.next(isFix);
    console.log("Setting Header State");
  }

  getHeaderState(): Observable<boolean> {
    return this.headerSubject.asObservable();
  }

}
