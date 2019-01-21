import { NgModule } from '@angular/core';
import { ViewportCheck } from './js-viewport-check.directive';
import { ClickedOutDirective } from './clicked-out.directive';

@NgModule({
    declarations: [
        ViewportCheck,
        ClickedOutDirective
    ],
    exports: [
        ViewportCheck,
        ClickedOutDirective
    ]
})
export class SharedModule {}