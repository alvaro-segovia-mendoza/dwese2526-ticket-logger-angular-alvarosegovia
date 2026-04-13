/**
 * Modelo para crear una región (equivalente a RegionCreateDTO del backend).
 * El backend ignora/recibe id=null en creación.
 */
export interface RegionCreate {
    id?: number | null;
    code: string;
    name: string;
}