import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FlamelinkService {
  content: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(private readonly afs: AngularFirestore) {
    let collections: AngularFirestoreCollection<any> = afs.collection<any>('fl_content');
    collections.valueChanges().subscribe((content) => {
      this.content.next(content);
    });
  }

  getContent(schemaName) {
    return this.content.pipe(
      map((contentList: any) => contentList.filter((content) => content._fl_meta_.schema === schemaName))
    );
  }
}
