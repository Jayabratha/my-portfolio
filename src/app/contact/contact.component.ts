import { Component, ViewChildren, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { routeAnimation } from '../animations/animations';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css', './../app.component.css', './../common.styles.css'],
  animations: [routeAnimation()],
  host: { '[@routeAnimation]': '' }
})
export class ContactComponent{

  @ViewChildren('tileItem') skillItems: QueryList<ElementRef>;

  constructor(private appState: AppStateService, private db: AngularFireDatabase, private renderer: Renderer2) {
    this.appState.setHeaderState(true);
  }

  emailSent: boolean = false;
  showError: boolean = false;

  messageData = {
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  }

  onSubmit(form) {
    if (!form.valid) {
      this.showError = true;
    } else {
      console.log(this.messageData);
      const name = this.messageData.lastName ? this.messageData.firstName + " " + this.messageData.lastName : this.messageData.firstName;
      const email = this.messageData.email;
      const message = this.messageData.message;
      const date = Date();
      const html = `
        <div>From: ${name}</div>
        <div>Email: <a href="mailto:${email}">${email}</a></div>
        <div>Date: ${date}</div>
        <div>Message: ${message}</div>
      `;

      let formRequest = { name, email, message, date, html };
      this.db.list('/messages').push(formRequest).then(() => {
        form.reset();
        this.showError = false;
        this.emailSent = true;
        setTimeout(() => {
          this.emailSent = false;
        }, 5000);
      },() => {
      });
    }
  }

  animateTiles() {
    if (this.skillItems) {
      setTimeout(() => {
        this.skillItems.forEach((elem, index) => {
          setTimeout(() => {
            this.renderer.removeClass(elem.nativeElement, 'hide');
          }, index * 150);
        });      
      }, 500);
    }
  }

}
