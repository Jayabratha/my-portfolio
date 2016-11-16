import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MeCardComponent } from './me-card/me-card.component';
import { MyWorksCardsComponent } from './my-works-cards/my-works-cards.component';
import { MySkillsCardsComponent } from './my-skills-cards/my-skills-cards.component';

@NgModule({
  declarations: [
    AppComponent,
    MeCardComponent,
    MyWorksCardsComponent,
    MySkillsCardsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
