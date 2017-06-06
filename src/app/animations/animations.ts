// import the required animation functions from the angular animations module
import { trigger, state, animate, transition, style } from '@angular/animations';

export function routeAnimation() {
    return trigger('routeAnimation', [
        
        transition(':enter', [
            style({ position: 'fixed', width: '100%', transform: 'translateY(300px)', opacity: 1 }),
            animate('0.8s ease-out', style({ transform: 'translateY(0)' }))
        ]),
        transition(':leave', [
            style({position: 'fixed', width: '100%', opacity: 1}),
            animate('0.3s ease-out', style({ opacity: 0 }))
        ])
    ]);
}

