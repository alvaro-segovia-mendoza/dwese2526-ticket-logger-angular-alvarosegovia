import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, timeout } from 'rxjs/operators';

import { RegionService } from '../../core/services/region.service';
import { RegionDetail } from '../../core/models/region-detail.model';


/**
* Componente de detalle de una Región.
*
* Muestra:
* - datos básicos de la región (id, code, name)
* - lista de provincias asociadas
*
* Ruta típica: /regions/:id
*/
@Component({
 selector: 'app-regions-detail',
 standalone: true,
 // CommonModule: necesario para @if/@for (control flow) y pipes comunes
 // RouterLink: para el enlace "Volver" sin recargar la SPA
 imports: [CommonModule, RouterLink],
 templateUrl: './region-detail.component.html',
 styleUrl: './region-detail.component.scss',
})
export class RegionDetailComponent implements OnInit {


 /** Región cargada desde el backend. null mientras no haya datos. */
 region: RegionDetail | null = null;


 /** true mientras se está cargando el detalle */
 loading = false;


 /** Mensaje de error a mostrar al usuario (si algo falla) */
 error: string | null = null;
 private readonly isBrowser: boolean;


 /**
  * @param route Para leer el parámetro :id de la URL (ActivatedRoute)
  * @param regionService Servicio que consulta el backend (/api/regions/{id})
  * @param cdr Permite forzar un refresco de la vista en casos de SSR/hydration donde a veces no se repinta automáticamente
  */
 constructor(
   private route: ActivatedRoute,
   private router: Router,
   private regionService: RegionService,
   private cdr: ChangeDetectorRef,
   @Inject(PLATFORM_ID) platformId: object
 ) {
   this.isBrowser = isPlatformBrowser(platformId);
 }


 /**
  * Se ejecuta al iniciar el componente:
  * 1) lee el id de la URL
  * 2) valida el id
  * 3) llama a loadRegion(id)
  */
 ngOnInit(): void {
   if (!this.isBrowser) {
     return;
   }

   // Leemos /regions/:id
   const idParam = this.route.snapshot.paramMap.get('id');
   const id = Number(idParam);


   // Validación básica
   if (!idParam || Number.isNaN(id)) {
     this.error = 'ID de región inválido';
     return;
   }


   this.loadRegion(id);
 }


 /**
  * Lanza la petición al backend para obtener el detalle.
  *
  * @param id ID de la región (numérico)
  */
 private loadRegion(id: number): void {
   if (!this.isBrowser) {
     return;
   }

   // Estado inicial: empezamos a cargar
   this.loading = true;
   this.error = null;


   /**
    * En algunos proyectos con SSR/hydration (o configuraciones de detección de cambios),
    * Angular puede no repintar de inmediato cuando cambia el estado.
    *
    * Este setTimeout(0) fuerza un ciclo de render para que se vea el "Cargando..."
    * antes de que termine la petición (sobre todo si es muy rápida).
    */
   setTimeout(() => this.cdr.detectChanges(), 0);


   // Petición al endpoint: GET /api/regions/{id}
   this.regionService.fetchRegionById(id).pipe(
     timeout(4000),
     finalize(() => {
       this.loading = false;
       setTimeout(() => this.cdr.detectChanges(), 0);
     })
   ).subscribe({
     next: (data) => {
       // Guardamos la región recibida
       this.region = data;
     },
     error: (err: unknown) => {
       // Mensajes de error claros según el status HTTP
       if (err instanceof HttpErrorResponse) {
         if (err.status === 404) this.error = 'Región no encontrada';
         else if (err.status === 401) {
           this.router.navigate(['/login']);
           return;
         }
         else if (err.status === 403) this.error = 'No tienes permisos';
         else this.error = 'Error al cargar el detalle';
       } else {
         this.error = 'Error al cargar el detalle';
       }
     },
   });
 }
}
