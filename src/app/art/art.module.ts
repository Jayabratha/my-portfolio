import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ImageOnLoadDirective } from '../image-on-load.directive';

import { ArtComponent } from './art.component';

const artRoutes: Routes = [
    { path: '', component: ArtComponent }
]

@NgModule({
    declarations: [ArtComponent,
    ImageOnLoadDirective
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(artRoutes)]
})
export class ArtModule {
}