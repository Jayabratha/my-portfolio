import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';
import { JsNgCarouselModule } from 'js-ng-carousel';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MeCardComponent } from './me-card/me-card.component';
import { JsOnscrollDirective } from './js-onscroll.directive';
import { ArtComponent } from './art/art.component';
import { ProjectsComponent } from './projects/projects.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadAnimateDirective } from './load-animate.directive';
import { BlogComponent } from './blog/blog.component';
import { ClickedOutDirective } from './clicked-out.directive';
import { GalleryComponent } from './gallery/gallery.component';

import { headerReducer } from './reducers/header.reducer';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent, data: { state: 'home' } },
  {
    path: 'art',
    component: ArtComponent,
    children: [
      {
        path: 'gallery/:title',
        component: GalleryComponent
      }
    ], data: { state: 'art' }
  },
  { path: 'projects', component: ProjectsComponent, data: { state: 'projects' } },
  { path: 'blog', component: BlogComponent, data: { state: 'blog' } },
  { path: 'about', component: AboutComponent, data: { state: 'about' } },
  { path: 'contact', component: ContactComponent, data: { state: 'contact' } },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MeCardComponent,
    JsOnscrollDirective,
    HomeComponent,
    ArtComponent,
    ProjectsComponent,
    AboutComponent,
    ContactComponent,
    LoadAnimateDirective,
    BlogComponent,
    ClickedOutDirective,
    GalleryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    JsNgCarouselModule,
    StoreModule.forRoot({
      header: headerReducer
    }),
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
