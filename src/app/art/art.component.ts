import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { routeAnimation } from '../animations/animations';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Subject, forkJoin, Observable } from 'rxjs';
import { tap } from "rxjs/operators";
import { Router } from '@angular/router';
import { ArtImage } from '../models/art-image.model';

import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { HeaderState } from '../models/header-state.enum';
import * as HeaderActions from '../actions/header.actions';

@Component({
    selector: 'app-art',
    templateUrl: './art.component.html',
    styleUrls: ['./art.component.css', './../app.component.css', './../common.styles.css'],
    animations: [routeAnimation()],
    host: { '[@routeAnimation]': '' }
})
export class ArtComponent implements OnInit {

    constructor(
        private store: Store<AppState>,
        private appState: AppStateService,
        private db: AngularFireDatabase,
        private storage: AngularFireStorage,
        private router: Router) {
    }

    imageList: Array<ArtImage> = [];
    isLoading: boolean = true;
    alert: string = "";
    alertType: string = "";
    imageLoadCount: number = 0;
    urlSubsciptions: Array<Observable<any>> = [];

    ngOnInit() {
        this.store.dispatch(new HeaderActions.UpdateState(HeaderState.Fixed));
        this.store.dispatch(new HeaderActions.ToggleMenu(false));

        if (navigator.onLine) {
            //Get list of images
            this.db.list('/artImages').valueChanges().subscribe((fileList: ArtImage[]) => {

                fileList.forEach((file: ArtImage) => {
                    Object.assign(file, { visible: false});
                    this.urlSubsciptions.push(this.storage.ref(file.thumbPath).getDownloadURL().pipe(
                        tap((url) => Object.assign(file, { thumbUrl: url }))));
                    this.urlSubsciptions.push(this.storage.ref(file.filePath).getDownloadURL().pipe(
                        tap((url) => Object.assign(file, { fileUrl: url }))));
                });

                forkJoin(this.urlSubsciptions).subscribe(() => {
                    this.imageList = fileList;
                    this.appState.setGalleryList(this.imageList);
                });
            });
        } else {
            this.isLoading = false;
            this.alert = "Ops! You are offline. Please connect to internet";
            this.alertType = "warn";
        }

    }

    updateProgress() {
        this.isLoading = false;
        this.imageLoadCount++;
        // if (this.imageLoadCount === this.imageList.length) {
        //     this.isLoading = false;
        //     this.imageList.forEach((image: ArtImage, index) => {
        //         setTimeout(() => {
        //             image.visible = true;
        //         }, (index + 1) * 150);
        //     });
        // }
    }

    showInGallery(item, elem) {
        this.appState.setGalleryItem(item);
        this.appState.setItemDimenion(elem);
        this.router.navigate(['/art/gallery/' + item.title]);
    }

}
