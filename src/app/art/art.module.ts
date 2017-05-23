import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArtComponent } from './art.component';

const artRoutes: Routes = [
    { path: '', component: ArtComponent }
]

@NgModule({
    declarations: [ArtComponent],
    imports: [RouterModule.forChild(artRoutes)]
})
export class ArtModule {}