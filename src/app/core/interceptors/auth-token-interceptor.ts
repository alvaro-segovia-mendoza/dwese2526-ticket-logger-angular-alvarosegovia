import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptr funcional:
 * - Intercepta todas las peticiones HTTP
 * - Si hay token, añade el header Authorization con el token
 * 
 * @param req Petición HTTP original (inmutable)
 * @param next Función para continuar la cadena de interceptores
 * @returns Observable con el evento HTTP resultante
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {

  // En interceptores funcionales, se usa `inject` para obtener servicios
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si no hay token, se continúa sin modificar la petición
  if (!token) {
    return next(req);
  }

  // Clonamos la petición original y añadimos el header Authorization con el token
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);

};
