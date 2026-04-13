import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { RegionService } from '../../core/services/region.service';
import { RegionUpdate } from '../../core/models/region-update.model';
import { ApiError } from '../../core/models/api-error.model';
import { RegionDetail } from '../../core/models/region-detail.model';


@Component({
 selector: 'app-region-edit',
 standalone: true,
 imports: [CommonModule, FormsModule, RouterLink],
 templateUrl: './region-edit.html',
 styleUrl: './region-edit.scss',
})
export class RegionEditComponent implements OnInit {


 /** Modelo del formulario (RegionUpdateDTO) */
 model: RegionUpdate = {
   id: 0,
   code: '',
   name: '',
 };


 loading = false;      // carga inicial (GET)
 saving = false;       // guardando (PUT)


 error: string | null = null;
 fieldErrors: Record<string, string> = {};


 constructor(
   private route: ActivatedRoute,
   private router: Router,
   private regionService: RegionService,
   private cdr: ChangeDetectorRef
 ) {}


 ngOnInit(): void {
   const idParam = this.route.snapshot.paramMap.get('id');
   const id = Number(idParam);


   if (!idParam || Number.isNaN(id)) {
     this.error = 'ID de región inválido';
     return;
   }


   this.loadRegion(id);
 }


 /**
  * Precarga la región para rellenar el formulario (GET /api/regions/:id).
  * Aunque el backend devuelva provincias, aquí solo usamos id, code, name.
  */
 private loadRegion(id: number): void {
   this.loading = true;
   this.error = null;


   setTimeout(() => this.cdr.detectChanges(), 0);


   this.regionService.fetchRegionById(id).subscribe({
     next: (data: RegionDetail) => {
       this.model = {
         id: data.id,
         code: data.code,
         name: data.name,
       };


       this.loading = false;
       setTimeout(() => this.cdr.detectChanges(), 0);
     },
     error: (err: unknown) => {
       this.loading = false;


       if (err instanceof HttpErrorResponse) {
         if (err.status === 404) this.error = 'Región no encontrada';
         else if (err.status === 401) this.error = 'No autenticado (haz login)';
         else if (err.status === 403) this.error = 'No tienes permisos';
         else this.error = 'Error al cargar la región';
       } else {
         this.error = 'Error al cargar la región';
       }


       setTimeout(() => this.cdr.detectChanges(), 0);
     },
   });
 }


 /**
  * Envía el update (PUT /api/regions/:id).
  */
 onSubmit(form: NgForm): void {
   if (form.invalid) return;


   this.saving = true;
   this.error = null;
   this.fieldErrors = {};


   setTimeout(() => this.cdr.detectChanges(), 0);


   const id = this.model.id;


   this.regionService.updateRegion(id, this.model).subscribe({
     next: () => {
       this.saving = false;


       // Al guardar, volvemos al detalle (o al listado, como prefieras)
       this.router.navigate(['/regions', id]);


       setTimeout(() => this.cdr.detectChanges(), 0);
     },
     error: (err: unknown) => {
       this.saving = false;


       if (err instanceof HttpErrorResponse) {
         const apiError = err.error as ApiError;


         if (err.status === 409) {
           this.error = apiError?.message || 'Código duplicado';
         } else if (err.status === 400) {
           this.error = apiError?.message || 'Validación fallida';
           if (apiError?.fieldErrors) this.fieldErrors = apiError.fieldErrors;
         } else if (err.status === 404) {
           this.error = 'Región no encontrada';
         } else if (err.status === 401) {
           this.error = 'No autenticado (haz login)';
         } else if (err.status === 403) {
           this.error = 'No tienes permisos';
         } else {
           this.error = 'Error al actualizar la región';
         }
       } else {
         this.error = 'Error al actualizar la región';
       }


       setTimeout(() => this.cdr.detectChanges(), 0);
     },
   });
 }
}
