export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Registro') {
    super(404, `${resource} no encontrado`);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Datos inválidos', details?: unknown) {
    super(400, message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autenticado') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'No tienes permisos para esta acción') {
    super(403, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Ya existe un registro con esos datos') {
    super(409, message);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Demasiadas solicitudes') {
    super(429, message);
  }
}
