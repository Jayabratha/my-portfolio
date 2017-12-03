import { Component } from '@angular/core';
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

  constructor(private appState: AppStateService, private db: AngularFireDatabase) {
    this.appState.setHeaderState(true);
  }

  showError: boolean = false;

  messageData = {
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  }

  onSubmit(isFormValid) {
    if (!isFormValid) {
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
      this.db.list('/messages').push(formRequest);
    }
  }

}
