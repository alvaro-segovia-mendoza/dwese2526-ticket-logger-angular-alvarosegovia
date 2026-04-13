import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page } from '../models/pagination.model';
import { Region } from '../models/region.model';
import { RegionDetail } from '../models/region-detail.model';
import { RegionCreate } from '../models/region-create.model';
import { RegionUpdate } from '../models/region-update.model';

export type SortDirection = 'asc' | 'desc';

@Injectable({ providedIn: 'root' })
export class RegionService {
  
  private readonly baseUrl = `${environment.apiUrl}/api/regions`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene una página de regiones desde el backend (Spring Pageable).
   * @param page número de página (0-based)
   * @param size tamaño de la página
   * @param sort "campo,direccion" -> ej: "name,asc"
   */
  fetchRegions(page: number, size: number, sort: string): Observable<Page<Region>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    return this.http.get<Page<Region>>(this.baseUrl, { params });
  }

  /**
   * Obtiene los detalles de una región por su ID.
   * El token NO se añade aquí: lo añade el interceptor automáticamente.
   * @param id ID de la región
   * @returns Observable con los detalles de la región
   */
  fetchRegionById(id: number): Observable<RegionDetail> {
    return this.http.get<RegionDetail>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crea una nueva región.
   * El token NO se añade aquí: lo añade el interceptor automáticamente.
   * @param dto Datos de la región a crear
   * @returns Observable con la región creada (incluye ID asignado por el backend)
   */
  createRegion(dto: RegionCreate): Observable<Region> {
    return this.http.post<Region>(this.baseUrl, dto);
  }

  /**
   * Actualiza una región existente.
   * El token NO se añade aquí: lo añade el interceptor automáticamente.
   * @param id ID de la región a actualizar
   * @param dto Datos de la región a actualizar
   * @returns Observable con la región actualizada
   */
  updateRegion(id: number, dto: RegionUpdate): Observable<Region> {
    return this.http.put<Region>(`${environment.apiUrl}/api/regions/${id}`, dto);
  }

  /**
   * Elimina una región existente.
   * El token NO se añade aquí: lo añade el interceptor automáticamente.
   * @param id ID de la región a eliminar
   * @returns Observable<void>
   */
  deleteRegion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
