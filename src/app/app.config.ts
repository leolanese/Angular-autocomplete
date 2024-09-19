import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'TOKEN', // 'XSRF-TOKEN'
        headerName: 'X-TOKEN' // 'X-XSRF-TOKEN'
      })
      ),
      provideZoneChangeDetection({ eventCoalescing: true }), 
      provideRouter(routes, withPreloading(PreloadAllModules)),
      provideAnimationsAsync()
  ]
};
