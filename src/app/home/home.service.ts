import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class HomeService {
    slideCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    setSlideCount(slideCount) {
        this.slideCount.next(slideCount);
    }

    getSlideCount() {
        return this.slideCount.asObservable();
    }

}