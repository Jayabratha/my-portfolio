import { sequence, trigger, stagger, animate, style, group, query as q, transition, keyframes, animateChild } from '@angular/animations';
const query = (s, a, o = { optional: true }) => q(s, a, o);

export const routerTransition = trigger('routerTransition', [
  transition('* => *', [
    query(':enter', style({ position: 'fixed', width: '100%' })),
      query(':enter', [
        style({ transform: 'translateY(300px)' }),
        animate('800ms ease-out',
          style({ transform: 'translateY(0px)' })
        )
      ])
  ])
]);