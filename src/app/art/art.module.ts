import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"

import { ArtListComponent } from './art-list/art-list.component';
import { ArtGalleryComponent } from './art-gallery/art-gallery.component';

import { ArtRoutingModule } from './art-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        ArtListComponent,
        ArtGalleryComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ArtRoutingModule
    ]
})
export class ArtModule {
}