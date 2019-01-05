// import the required animation functions from the angular animations module
import { trigger, state, animate, transition, style } from '@angular/animations';

export function routeAnimation() {
    return trigger('routeAnimation', [
        state('*', style({position: 'absolute', width: '100%'})),
        transition(':enter', [
            style({  transform: 'translateY(300px)' }),
            animate('0.8s ease-out', style({ transform: 'translateY(0px)' }))
        ]),
        transition(':leave', [
            style({ position: 'absolute', width: '100%', opacity: 1}),
            animate('0.3s ease-out', style({ opacity: 0 }))
        ])
    ]);
}

