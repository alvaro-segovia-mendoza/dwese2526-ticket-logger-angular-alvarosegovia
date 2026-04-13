import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


/**
* Respuesta REAL del backend al autenticar:
* {
*   "token": "xxxxx.yyyyy.zzzzz",
*   "message": "Authentication successful"
* }
*/
export interface AuthResponse {
 token: string;
 message: string;
}


@Injectable({ providedIn: 'root' })
export class AuthService {
 /** Clave donde guardamos el token en el storage del navegador */
 private readonly TOKEN_KEY = 'auth_token';


 /** true si estamos en navegador; false si estamos en servidor (SSR) */
 private readonly isBrowser: boolean;


 /**
  * Guardamos el token en memoria con un BehaviorSubject.
  * En SSR NO podemos leer localStorage, así que empezamos en null.
  * En navegador, cargamos el token en el constructor.
  */
 private token$ = new BehaviorSubject<string | null>(null);


 constructor(
   private http: HttpClient,
   private router: Router,
   @Inject(PLATFORM_ID) platformId: object
 ) {
   // Detecta si estamos en el navegador (donde existe localStorage)
   this.isBrowser = isPlatformBrowser(platformId);


   // Solo en navegador podemos leer localStorage
   if (this.isBrowser) {
     const savedToken = localStorage.getItem(this.TOKEN_KEY);
     this.token$.next(savedToken);
   }
 }


 /**
  * Hace login contra el backend y, si va bien, guarda el token.
  */
  login(username: string, password: string): Observable<AuthResponse> {
   return this.http
     .post<AuthResponse>(`${environment.apiUrl}/api/auth/authenticate`, { username, password })
     .pipe(
       tap((res) => this.saveToken(res.token))
     );
 }


 /**
  * Guarda el token:
  * - en localStorage (solo si estamos en navegador)
  * - y en el BehaviorSubject (para que la app reaccione al cambio)
  */
 private saveToken(token: string): void {
   if (this.isBrowser) {
     localStorage.setItem(this.TOKEN_KEY, token);
   }
   this.token$.next(token);
 }


 /**
  * Devuelve el token actual (o null si no hay).
  */
 getToken(): string | null {
   const token = this.token$.value;

   if (token) {
     return token;
   }

   if (this.isBrowser) {
     const savedToken = localStorage.getItem(this.TOKEN_KEY);

     if (savedToken) {
       this.token$.next(savedToken);
     }

     return savedToken;
   }

   return null;
 }


 /**
  * Indica si el usuario está logueado (true si hay token).
  */
 isLoggedIn(): Observable<boolean> {
   return this.token$.pipe(map((token) => token !== null));
 }


 /**
  * Cierra sesión:
  * - borra el token (solo si estamos en navegador)
  * - redirige al login
  */
 logout(redirectTo: string = '/login'): void {
   if (this.isBrowser) {
     localStorage.removeItem(this.TOKEN_KEY);
   }
   this.token$.next(null);
   this.router.navigate([redirectTo]);
 }
}
