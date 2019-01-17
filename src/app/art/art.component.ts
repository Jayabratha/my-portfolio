import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { forkJoin, Observable } from 'rxjs';
import { tap } from "rxjs/operators";
import { Router } from '@angular/router';
import { ArtImage } from '../models/art-image.model';

import { Store } from '@ngrx/store';
import { AppState } from '../app-store/app.state';
import { HeaderState } from '../models/header-state.enum';
import * as HeaderActions from '../app-store/actions/header.actions';
import { UpdateGalleryList, UpdateCurrentItem, UpdateCurrentItemDimension } from '../app-store/actions/gallery.actions';

@Component({
    selector: 'app-art',
    templateUrl: './art.component.html',
    styleUrls: ['./art.component.css', './../app.component.css']
})
export class ArtComponent implements OnInit {

    constructor(
        private store: Store<AppState>,
        private db: AngularFireDatabase,
        private storage: AngularFireStorage,
        private router: Router) {
    }

    imageList: Array<ArtImage> = [];
    isLoading: boolean = true;
    alert: string = "";
    alertType: string = "";
    urlSubsciptions: Array<Observable<any>> = [];
    galleryLayout: Array<Array<ArtImage>> = [];
    rowLoadMap: Array<{visible: boolean, loaded: boolean}> = [];

    @ViewChild('container') galleryContainer: ElementRef;

    ngOnInit() {
        this.store.dispatch(new HeaderActions.UpdateState(HeaderState.Fixed));
        this.store.dispatch(new HeaderActions.ToggleMenu(false));


        if (navigator.onLine) {
            //Get list of images
            this.db.list('/artImages').valueChanges()
                .subscribe((fileList: ArtImage[]) => {
                    this.imageList = fileList;
                    fileList.forEach((file) => Object.assign(file, {
                        loaded: false,
                        visible: false
                    }));
                    this.generateGridLayout(fileList);
                    this.isLoading = false;
                    this.downloadImages(this.galleryLayout[0], 0);
                });
        } else {
            this.isLoading = false;
            this.alert = "Ops! You are offline. Please connect to internet";
            this.alertType = "warn";
        }
    }

    downloadImages(imageList, rowIndex) {
        imageList.forEach((file: ArtImage) => {
            this.urlSubsciptions.push(this.storage.ref(file.thumbPath).getDownloadURL().pipe(
                tap((url) => Object.assign(file, { thumbUrl: url }))));
            this.urlSubsciptions.push(this.storage.ref(file.filePath).getDownloadURL().pipe(
                tap((url) => Object.assign(file, { fileUrl: url }))));
        });

        forkJoin(this.urlSubsciptions).subscribe(() => {
            this.rowLoadMap[rowIndex].loaded = true;
            this.store.dispatch(new UpdateGalleryList(this.imageList));
        });
    }

    getMinAspectRatio(lastWindowWidth) {
        if (lastWindowWidth <= 640)
            return 2;
        else if (lastWindowWidth <= 1280)
            return 2.5;
        else if (lastWindowWidth <= 1920)
            return 4;
        return 5;
    }

    generateGridLayout(imageList) {
        let imageCount = imageList.length;
        let totalWidth = this.galleryContainer.nativeElement.clientWidth;
        let rowAspectRatio = 0;
        let minAspectRatio = this.getMinAspectRatio(totalWidth);
        let row = [];

        this.galleryLayout = [];
        imageList.forEach((image, index) => {
            rowAspectRatio += (image.width / image.height);
            row.push(image);
            if (rowAspectRatio >= minAspectRatio || index + 1 === imageCount) {
                rowAspectRatio = Math.max(rowAspectRatio, minAspectRatio);
                let rowHeight = totalWidth / rowAspectRatio;

                row.forEach((image) => {
                    let imageWidth = rowHeight * (image.width / image.height);
                    Object.assign(image, {
                        thumbWidth: Math.floor(imageWidth),
                        thumbHeight: Math.floor(rowHeight)
                    });
                });
                this.galleryLayout.push(row);
                this.rowLoadMap.push({visible: false, loaded: false});
                row = [];
                rowAspectRatio = 0;
            }
        });
    }

    updateProgress(image, row, rowIndex) {
        image.loaded = true;
        if (this.rowLoadMap[rowIndex].visible) {
            this.animateRowItems(row, rowIndex);
        }        
    }

    animateRowItems(row, rowIndex) {
        let imageLoadCount = 0;
        this.rowLoadMap[rowIndex].visible = true;
        row.forEach((image) => {
            if (image.loaded) {
                imageLoadCount++;
            }
        });
        if (imageLoadCount === row.length) {
            row.forEach((image: ArtImage, index) => {
                setTimeout(() => {
                    image.visible = true;
                }, (index + 1) * 150);
            });
        }
        //Download the next row images
        if (rowIndex !== this.rowLoadMap.length - 1 && !this.rowLoadMap[rowIndex + 1].loaded) {
            this.downloadImages(this.galleryLayout[rowIndex + 1], rowIndex + 1);
        }        
    }

    hideRowItems(row, rowIndex) {
        row.forEach((image) => {
            image.visible = false;
        });
        this.rowLoadMap[rowIndex].visible = false;
    }

    showInGallery(item, elem) {
        this.store.dispatch(new UpdateCurrentItem(item));
        this.store.dispatch(new UpdateCurrentItemDimension(elem.getBoundingClientRect()));
        this.router.navigate(['/art/gallery/' + item.title]);
    }

}
