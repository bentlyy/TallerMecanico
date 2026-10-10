import axios from 'axios';

export function getErrorMessage(error: unknown, fallback: string): string {
  if (!navigator.onLine) {
    return 'Sin conexión a internet. Revisá tu conexión e intentá de nuevo.';
  }

  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'La conexión tardó demasiado. Intentá de nuevo.';
    }

    if (!error.response) {
      return 'No se pudo conectar con el servidor. Revisá tu conexión a internet e intentá de nuevo.';
    }

    const data = error.response.data as { error?: string; message?: string } | undefined;
    if (data?.error) {
      return data.error;
    }
    if (data?.message) {
      return data.message;
    }

    const status = error.response.status;
    if (status >= 500) {
      return 'Ocurrió un error en el servidor. Intentá de nuevo más tarde.';
    }
    if (status === 403) {
      return 'No tenés permisos para realizar esta acción.';
    }
    if (status === 404) {
      return 'El recurso solicitado no existe.';
    }
  }

  return fallback;
}
