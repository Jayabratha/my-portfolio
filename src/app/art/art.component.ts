import { Component } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { routeAnimation } from '../animations/animations';

@Component({
  selector: 'app-art',
  templateUrl: './art.component.html',
  styleUrls: ['./art.component.css', './../app.component.css', './../common.styles.css'],
  animations: [routeAnimation()],
  host: { '[@routeAnimation]': '' }
})
export class ArtComponent {

  constructor(private appState: AppStateService) {
    this.appState.setHeaderState(true);
  }

  artList: Object[] = [{
        id: "art1",
        url: "../assets/images/art/Farah.jpg",
        title: "Farah",
        alt: "Farah",
        description: "",
        isPotraitMode: true
    }, {
        id: "art2",
        url: "../assets/images/art/MenModel.jpg",
        title: "Men Model",
        alt: "Men Model",
        description: "",
        isPotraitMode: false
    }, {
        id: "art3",
        url: "../assets/images/art/Fabric.jpg",
        title: "Fabric",
        alt: "Fabric",
        description: "",
        isPotraitMode: true
    }, {
        id: "art4",
        url: "../assets/images/art/Mortality.jpg",
        title: "Mortality",
        alt: "Mortality",
        description: "",
        isPotraitMode: true
    }, {
        id: "art5",
        url: "../assets/images/art/Angelina.jpg",
        title: "Angelina",
        alt: "Angelina",
        description: "",
        isPotraitMode: true
    }, {
        id: "art6",
        url: "../assets/images/art/Water.jpg",
        title: "Water",
        alt: "Water",
        description: "",
        isPotraitMode: false
    }, {
        id: "art7",
        url: "../assets/images/art/Elena.jpg",
        title: "Elena",
        alt: "Elena",
        description: "",
        isPotraitMode: true
    }, {
        id: "art8",
        url: "../assets/images/art/Marmaid.jpg",
        title: "Marmaid",
        alt: "Marmaid",
        description: "",
        isPotraitMode: true
    }, {
        id: "art9",
        url: "../assets/images/art/Twilight.jpg",
        title: "Twilight",
        alt: "Twilight",
        description: "",
        isPotraitMode: true
    }, {
        id: "art10",
        url: "../assets/images/art/PoP.jpg",
        title: "Price Of Persia",
        alt: "Price Of Persia",
        description: "",
        isPotraitMode: true
    }];

}
