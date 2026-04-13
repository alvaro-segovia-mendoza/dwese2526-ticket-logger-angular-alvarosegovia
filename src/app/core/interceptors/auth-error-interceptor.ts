import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor funcional de errores:
 * - 401 -> no autenticado (token inválido/expirado): hacemos logout y vamos a /login
 * - 403 -> autenticado pero sin permisos: vamos a /forbidden
 * 
 * @param req Petición HTTP original
 * @param next Función para continuar la cadena de interceptores
 * @returns Observable con la respuesta (o error) HTTP
 */
export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (isBrowser && err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          auth.logout('/login');
        } else if (err.status === 403) {
          router.navigate(['/forbidden']);
        }
      }
      return throwError(() => err);
    })
  );
};
