import axios from 'axios';

interface PaginatedEnvelope {
  data: unknown[];
  total: number;
}

function isPaginatedEnvelope(value: unknown): value is PaginatedEnvelope {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as { data?: unknown }).data) &&
    typeof (value as { total?: unknown }).total === 'number'
  );
}

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => {
    if (isPaginatedEnvelope(response.data)) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Sin sesión en el Core: mandamos al login central. El backend incluye el
      // loginUrl en el cuerpo del 401; si no está, usamos la ruta local que
      // redirige al Core.
      const loginUrl = error.response?.data?.loginUrl as string | undefined;
      window.location.href = loginUrl || '/api/auth/login';
    }
    return Promise.reject(error);
  },
);

export default api;
