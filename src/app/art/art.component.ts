import { Component, ElementRef, ViewChildren, OnInit, QueryList, AfterViewInit, Renderer2 } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { routeAnimation } from '../animations/animations';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Subject, forkJoin, Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Router } from '@angular/router';

@Component({
    selector: 'app-art',
    templateUrl: './art.component.html',
    styleUrls: ['./art.component.css', './../app.component.css', './../common.styles.css'],
    animations: [routeAnimation()],
    host: { '[@routeAnimation]': '' }
})
export class ArtComponent implements OnInit {

    constructor(private appState: AppStateService,
        private renderer: Renderer2,
        private db: AngularFireDatabase,
        private storage: AngularFireStorage,
        private router: Router) {
        this.appState.setHeaderState(true);
    }

    @ViewChildren('imgItem') imageItems: QueryList<ElementRef>;

    imageList: Array<Object> = [];
    isLoading: boolean = false;
    alert: string = "";
    alertType: string = "";
    urlSubsciptions: Array<Observable<any>> = [];

    ngOnInit() {
        if (navigator.onLine) {
            //Get list of images
            this.db.list('/artImages').valueChanges().subscribe((fileList) => {
                this.isLoading = true;
                fileList.forEach((file: any) => {
                    this.urlSubsciptions.push(this.storage.ref(file.thumbPath).getDownloadURL().pipe(
                        map((url) => {
                            return Object.assign(file, {thumbUrl: url});
                        }
                    )));                    
                    this.urlSubsciptions.push(this.storage.ref(file.filePath).getDownloadURL().pipe(
                        map((url) => {
                            return Object.assign(file, {fileUrl: url});
                        }
                    )));
                });
                forkJoin(this.urlSubsciptions).subscribe((urls) => {
                    this.imageList = fileList;
                    this.appState.setGalleryList(this.imageList);
                    this.isLoading = false;
                })

            });
        } else {
            this.alert = "You are offline. Please connect to internet";
            this.alertType = "warn";
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
