import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './shared/interfaces/auth.interceptor';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localeEl from '@angular/common/locales/el';

// Καταχώρηση της ελληνικής τοπικής ρύθμισης
registerLocaleData(localeEl);

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
  provideRouter(routes), 
  { provide: LOCALE_ID, useValue: 'el' } ,
  provideAnimationsAsync(),
  provideHttpClient(
    withInterceptorsFromDi()
  ),
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }
  ]
};