import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


import { RegionService } from '../../core/services/region.service';
import { RegionCreate } from '../../core/models/region-create.model';
import { ApiError } from '../../core/models/api-error.model';


@Component({
 selector: 'app-region-create',
 standalone: true,
 imports: [CommonModule, FormsModule, RouterLink],
 templateUrl: './region-create.html',
 styleUrls: ['./region-create.scss'],
})
export class RegionCreateComponent {


 /**
  * Modelo del formulario.
  * id en creación puede ser null (backend lo ignora / lo crea).
  */
 model: RegionCreate = {
   id: null,
   code: '',
   name: '',
 };


 /** Estado UI */
 loading = false;


 /** Error general (arriba del formulario) */
 error: string | null = null;


 /**
  * Errores por campo (para 400 validación).
  * Ej: fieldErrors.code = "El código no puede..."
  */
 fieldErrors: Record<string, string> = {};


 constructor(
   private regionService: RegionService,
   private router: Router,
   private cdr: ChangeDetectorRef
 ) {}


 /**
  * Envía el formulario al backend (POST /api/regions).
  */
 onSubmit(form: NgForm): void {
   if (form.invalid) return;


   this.loading = true;
   this.error = null;
   this.fieldErrors = {};


   // Forzamos repintado del "Creando..." (por tu problema de render)
   setTimeout(() => this.cdr.detectChanges(), 0);


   this.regionService.createRegion(this.model).subscribe({
     next: () => {
       this.loading = false;


       // Redirigimos al listado tras crear
       this.router.navigate(['/regions']);


       // repaint por si acaso
       setTimeout(() => this.cdr.detectChanges(), 0);
     },
     error: (err: unknown) => {
       this.loading = false;


       if (err instanceof HttpErrorResponse) {
         const apiError = err.error as ApiError;


         // 409: duplicado de código
         if (err.status === 409) {
           // Puedes usar apiError.message directamente:
           // "Duplicate region (code=01)"
           this.error = apiError?.message || 'Código de región duplicado';
         }


         // 400: validación (fieldErrors)
         else if (err.status === 400) {
           this.error = apiError?.message || 'Validación fallida';


           if (apiError?.fieldErrors) {
             this.fieldErrors = apiError.fieldErrors;
           }
         }


         // Otros errores
         else if (err.status === 401) {
           this.error = 'No autenticado (haz login)';
         } else if (err.status === 403) {
           this.error = 'No tienes permisos';
         } else {
           this.error = 'Error al crear la región';
         }
       } else {
         this.error = 'Error al crear la región';
       }


       // repaint para que se vean los errores
       setTimeout(() => this.cdr.detectChanges(), 0);
     },
   });
 }
}
