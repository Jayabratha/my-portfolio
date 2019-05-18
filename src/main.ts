import './polyfills.ts';
import 'hammerjs';
// import "scroll-behavior-polyfill";

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/';

if (environment.production) {
  enableProdMode();
}

// async function loadScrollPolyfill() {
//   if (!("scrollBehavior" in document.documentElement.style)) {
//     await import("scroll-behavior-polyfill");
    
//   }
// }

platformBrowserDynamic().bootstrapModule(AppModule);
