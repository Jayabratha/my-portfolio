import { Component, ElementRef, ViewChildren, OnInit, QueryList, AfterViewInit, Renderer2 } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { routeAnimation } from '../animations/animations';
import { AngularFireDatabase } from 'angularfire2/database';
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

    imageList: Array<Object>;
    isLoading: boolean = true;

    constructor(private appState: AppStateService, private renderer: Renderer2, private db: AngularFireDatabase) {
        this.appState.setHeaderState(true);
    }

    ngOnInit() {
        //Get list of images
        this.db.list('/artImages').valueChanges().map((fileList) => {
            fileList.forEach((file: any) => {
                let storageRef = this.storage.ref();
                storageRef.child(file.filePath).getDownloadURL().then((url) => {
                    Object.assign(file, {url: url});
                });               
            });
            return fileList;
        }).subscribe((images) => {
            this.imageList = images;
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.isLoading = false;
            this.imageItems.forEach((elem, index) => {
                setTimeout(() => {
                    this.renderer.removeClass(elem.nativeElement, 'hide');
                }, index * 200);
            });
        }, 3000);
    }

}
