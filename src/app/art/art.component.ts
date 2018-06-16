import { Component, ElementRef, ViewChildren, OnInit, QueryList, AfterViewInit, Renderer2 } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { routeAnimation } from '../animations/animations';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
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
    alert: string = "";
    alertType: string = "";

    constructor(private appState: AppStateService, private renderer: Renderer2, private db: AngularFireDatabase, private router: Router) {
        this.appState.setHeaderState(true);
    }

    ngOnInit() {
        if (navigator.onLine) {
            //Get list of images
            this.db.list('/artImages').valueChanges().subscribe((fileList) => {
                let promises = [];
                this.isLoading = true;
                fileList.forEach((file: any) => {
                    let storageRef = this.storage.ref();
                    promises.push(storageRef.child(file.thumbPath).getDownloadURL().then((url) => {
                        Object.assign(file, { thumbUrl: url });
                    }));
                    promises.push(storageRef.child(file.filePath).getDownloadURL().then((url) => {
                        Object.assign(file, { fileUrl: url });
                    }));
                });
                //Set the images once all download urls have been fetched
                Promise.all(promises).then(() => {
                    this.imageList = fileList;
                    this.appState.setGalleryList(this.imageList);
                    this.isLoading = false;
                });
            });
        } else {
            this.alert="You are offline. Please connect to internet";
            this.alertType="warn";
        }

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
                setTimeout(() => {
                    this.imageItems.forEach((elem, index) => {
                        let imageElem = elem.nativeElement;
                        setTimeout(() => {
                            this.renderer.removeClass(imageElem, 'hide');
                        }, index * 150);
                    });
                }, 200);
            }
        });
    }

    showInGallery(item) {
        this.appState.setGalleryItem(item);
        this.router.navigate(['/art/gallery/' + item.title]);
    }

}
