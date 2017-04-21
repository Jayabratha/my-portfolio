import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MeCardComponent } from './me-card/me-card.component';
import { JsOnscrollDirective } from './js-onscroll.directive';
import { JsCarouselComponent } from './js-carousel/js-carousel.component';
import { ArtComponent } from './art/art.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'art', component: ArtComponent },
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
    ArtComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'art',
        component: ArtComponent
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
