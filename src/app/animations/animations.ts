import { trigger, animate, style, query, transition } from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
  transition('* => *', [
    query(':enter', style({ position: 'fixed', width: '100%' }), { optional: true }),
      query(':enter', [
        style({ transform: 'translateY(300px)' }),
        animate('800ms ease-out',
          style({ transform: 'translateY(0px)' })
        )
      ], { optional: true })
  ])
]);