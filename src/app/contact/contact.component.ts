import { Component } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { routeAnimation } from '../animations/animations';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css', './../app.component.css', './../common.styles.css'],
  animations: [routeAnimation()],
  host: { '[@routeAnimation]': '' }
})
export class ContactComponent{

  constructor(private appState: AppStateService) {
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
    }
  }

}
