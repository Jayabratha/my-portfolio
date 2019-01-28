import { Component, OnInit, ViewChildren, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
declare var google: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css', './../app.component.css']
})
export class ContactComponent implements OnInit {

  @ViewChildren('tileItem') skillItems: QueryList<ElementRef>;

  constructor(
    private db: AngularFireDatabase,
    private renderer: Renderer2) {
  }

  ngOnInit() {
    // let uluru = new google.maps.LatLng(12.957044, 77.701223);
    // // The map, centered at Uluru
    // let map = new google.maps.Map(
    //   document.getElementById('map'), { zoom: 4, center: uluru });
    // // The marker, positioned at Uluru
    // let marker = new google.maps.Marker({ position: uluru, map: map });
  }

  sendingEmail: boolean = false;
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
      this.sendingEmail = true;
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
        this.sendingEmail = false;
        this.emailSent = true;
        setTimeout(() => {
          this.emailSent = false;
        }, 2000);
      }, () => {
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
