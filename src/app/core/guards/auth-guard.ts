import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // En SSR no podemos depender de localStorage; dejamos que el cliente resuelva la sesión.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = auth.getToken();

  if (token) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
