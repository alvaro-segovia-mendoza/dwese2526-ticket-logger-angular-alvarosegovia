/**
 * Error estándar que devulve tu API.
 * (vale para 400 validación y 409 duplicados).
 */
export interface ApiError {
    timestamp: string;
    sstatus: number;
    error: string;
    message: string;
    path: string;

    // para 409
    resource?: string | null;
    field?: string | null;
    value?: string | null;

    // para 409 (validación)
    fieldErrors?: Record<string, string> | null; // ej: { "code": "..." }
}