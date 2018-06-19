import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MeCardComponent } from './me-card/me-card.component';
import { JsOnscrollDirective } from './js-onscroll.directive';
import { JsCarouselComponent } from './js-carousel/js-carousel.component';
import { ArtComponent } from './art/art.component';
import { ProjectsComponent } from './projects/projects.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadAnimateDirective } from './load-animate.directive';
import { BlogComponent } from './blog/blog.component';
import { ClickedOutDirective } from './clicked-out.directive';
import { GalleryComponent } from './gallery/gallery.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  // { path: 'art', loadChildren: './art/art.module#ArtModule'},
  { path: 'art',
   component: ArtComponent,
    children: [
      {
        path: 'gallery/:title',
        component: GalleryComponent
      }
    ]
  },
  { path: 'projects', component: ProjectsComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
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
    JsCarouselComponent,
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
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
