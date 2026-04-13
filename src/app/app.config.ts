import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { authTokenInterceptor } from './core/interceptors/auth-token-interceptor';
import { authErrorInterceptor } from './core/interceptors/auth-error-interceptor';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authTokenInterceptor, authErrorInterceptor])),
  ]
};
