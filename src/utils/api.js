/**
 * Utilidades para llamadas a API
 * 
 * En desarrollo: Las peticiones se hacen a http://localhost:5173/api
 * que Vite redirige a http://localhost:8080/api
 * 
 * En producción: Las peticiones se hacen a /api
 * que debe estar configurado en tu servidor
 */

const API_BASE_URL = import.meta.env.PROD 
    ? import.meta.env.VITE_API_URL_PROD 
    : import.meta.env.VITE_API_URL_DEV;

export class APIError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Realiza una petición fetch con manejo automático de errores
 * @param {string} endpoint - La ruta de la API (ej: /usuarios/login)
 * @param {object} options - Opciones de fetch (method, body, headers, etc)
 * @param {boolean} skipBaseUrl - Si true, no agrega el API_BASE_URL (para rutas raíz como /login)
 * @returns {Promise} - Los datos de la respuesta
 */
export async function apiCall(endpoint, options = {}, skipBaseUrl = false) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Si existe un token, agregarlo al header de autorización
    const token = localStorage.getItem('token');
    if (token) {
        defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        // Si la respuesta no es exitosa
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            console.error(`[API] Error ${response.status}:`, data);
            throw new APIError(
                data.message || `Error ${response.status}: ${response.statusText}`,
                response.status,
                data
            );
        }

        // Si el método es DELETE y no hay contenido
        if (response.status === 204) {
            return null;
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }

        // Error de red u otro error
        console.error('[API] Network error:', error);
        throw new APIError(
            error.message || 'Error de conexión con el servidor',
            0,
            null
        );
    }
}

/**
 * GET - Obtener datos
 */
export async function apiGet(endpoint) {
    return apiCall(endpoint, {
        method: 'GET',
    });
}

/**
 * POST - Crear datos
 */
export async function apiPost(endpoint, data) {
    return apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * PUT - Actualizar datos
 */
export async function apiPut(endpoint, data) {
    return apiCall(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

/**
 * DELETE - Eliminar datos
 */
export async function apiDelete(endpoint) {
    return apiCall(endpoint, {
        method: 'DELETE',
    });
}

/**
 * PATCH - Actualización parcial
 */
export async function apiPatch(endpoint, data) {
    return apiCall(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

/**
 * POST Login - Ruta especial sin prefijo /api
 * @param {object} credentials - { username, password }
 * @returns {Promise} - { token, role }
 */
export async function loginRequest(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new APIError(
                data.message || `Error ${response.status}: ${response.statusText}`,
                response.status,
                data
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }

        throw new APIError(
            error.message || 'Error de conexión con el servidor',
            0,
            null
        );
    }
}
