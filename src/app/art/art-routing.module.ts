import { NgModule } from '@angular/core';
import { ArtListComponent } from './art-list/art-list.component';
import { ArtGalleryComponent } from './art-gallery/art-gallery.component'
import { RouterModule } from '@angular/router';

const artRoutes = [{
  path: '',
  component: ArtListComponent,
  children: [
    {
      path: 'gallery/:title',
      component: ArtGalleryComponent
    }
  ], data: { state: 'art' }
}]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(artRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ArtRoutingModule { }
