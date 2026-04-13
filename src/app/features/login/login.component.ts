import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = '';
  password = '';

  /** Mensaje de error para mostrar en pantalla (null = no mostrar) */
  error: string | null = null;

  /** Para deshabilitar el botón mientras hacemos la petición */
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}
    /**
     * Se ejecuta al enviar el formulario.
     * - Llama al backend (AuthService.login)
     * - si OK: redirige a /regions
     * - Si KO: muestra error
     */
    onSubmit(): void {
      // Limpia mensajes anteriores
      this.error = null;
      this.loading = true;

      this.auth.login(this.username, this.password).subscribe({
        next: (res) => {
          // El AuthService guarda el token automáticamente.
          // Puedes usar el message si quieres enseñarlo:
          // console.log(res.message);

          this.loading = false;
          this.router.navigate(['/regions']);
        },
        error: (err: unknown) => {
          this.loading = false;

          // Mensaje sencillo para alumnado
          this.error = 'Usuario o contraseña inválidos';

          // Opcional: si quieres distinguir errores reales
          if (err instanceof HttpErrorResponse) {
            if (err.status === 0) {
              this.error = 'No se puede conectar con el servidor';
            } else if (err.status === 401) {
              this.error = 'Usuario o contraseña inválidos';
          }
        }
      },
    });
  }
}
