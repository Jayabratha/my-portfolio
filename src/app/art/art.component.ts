import { Component, ElementRef, ViewChildren, OnInit, QueryList, AfterViewInit, Renderer2 } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { routeAnimation } from '../animations/animations';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

@Component({
    selector: 'app-art',
    templateUrl: './art.component.html',
    styleUrls: ['./art.component.css', './../app.component.css', './../common.styles.css'],
    animations: [routeAnimation()],
    host: { '[@routeAnimation]': '' }
})
export class ArtComponent implements OnInit {

    @ViewChildren('imgItem') imageItems: QueryList<ElementRef>;

    private storage = firebase.storage();

    imageList: Array<Object> = [];
    isLoading: boolean = false;

    constructor(private appState: AppStateService, private renderer: Renderer2, private db: AngularFireDatabase) {
        this.appState.setHeaderState(true);
    }

    ngOnInit() {
        //Get list of images
        this.db.list('/artImages').valueChanges().subscribe((fileList) => {
            let promises = [];
            this.isLoading = true;
            fileList.forEach((file: any) => {
                let storageRef = this.storage.ref();
                promises.push(storageRef.child(file.thumbPath).getDownloadURL().then((url) => {
                    Object.assign(file, { url: url });
                }));
            });
            //Set the images once all download urls have been fetched
            Promise.all(promises).then(() => {
                this.imageList = fileList;
            });
        });
    }

    ngAfterViewInit() {
        let i = 1;
        let imagesCount = 0;
        let loadedImagesCount: Subject<number> = new Subject<number>();

        this.imageItems.changes.subscribe((imageItems) => {
            imagesCount = this.imageList.length;
            if (imageItems.length === imagesCount) {
                imageItems.forEach((elem, index) => {
                    let imageElem = elem.nativeElement;
                    if (imageElem.complete) {
                        loadedImagesCount.next(i++);
                    } else {
                        imageElem.addEventListener('load', () => {
                            loadedImagesCount.next(i++);
                        });
                    }
                });
            }
        });

        loadedImagesCount.asObservable().subscribe((count) => {
            if (count === imagesCount) {
                this.isLoading = false;
                this.imageItems.forEach((elem, index) => {
                    let imageElem = elem.nativeElement;
                    setTimeout(() => {
                        this.renderer.removeClass(imageElem, 'hide');
                    }, index * 150);
                });
            }
        });
    }

}
