import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  // CommonModule: necesario si en el HTML usamos @if / @for (o directivas como ngIf / ngFor)
  // RouterLink: permite navegar sin recargar la página (evita "Cannot GET /ruta")
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  /**
   * Observable booleano que indica si el usuario está logueado.
   * - true -> hay token (mostrar logout / enlaces privados)
   * - false -> no hay token (mostrar Login)
   * 
   * Lo usamos en el HTML con:
   *   @if (isLoggedIn$ | async) { ... } @else { ... }
   */
  isLoggedIn$: Observable<boolean>;

  /**
   * Inyectamos AuthService para:
   * - consultar si hay sesión (token)
   * - cerrar sesión (logout)
   * 
   * @param authService Servicio de autenticación
   */
  constructor(private authService: AuthService) {
    // Nos suscribimos "de forma declarativa" desde el HTML usando async pipe,
    // por eso aquí solo asignamos el observable.
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  /**
   * Cierra sesión del usuario.
   * - Borra el token
   * - Redirige a /login
   */
  logout(): void {
    this.authService.logout('/login');
  }

}
