/**
 * Modelo genérico de paginación tipo Spring Page<T>.
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number; // tamaño de página
  number: number; // página actual (0-based)
  numberOfElements: number; 
  first: boolean;
  last: boolean;
  empty: boolean;
}
