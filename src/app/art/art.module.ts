import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ArtComponent } from './art.component';

const artRoutes: Routes = [
    { path: '', component: ArtComponent }
]

@NgModule({
    // declarations: [ArtComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(artRoutes)]
})
export class ArtModule {
}