export class AppError extends Error {
  constructor(mensaje, statusCode = 500, code = null) {
    super(mensaje);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(mensaje = 'Solicitud inválida') {
    return new AppError(mensaje, 400, 'BAD_REQUEST');
  }

  static unauthorized(mensaje = 'No autorizado') {
    return new AppError(mensaje, 401, 'UNAUTHORIZED');
  }

  static forbidden(mensaje = 'Acceso prohibido') {
    return new AppError(mensaje, 403, 'FORBIDDEN');
  }

  static notFound(recurso = 'Recurso') {
    return new AppError(`${recurso} no encontrado`, 404, 'NOT_FOUND');
  }

  static conflict(mensaje = 'Ya existe un registro con esos datos') {
    return new AppError(mensaje, 409, 'CONFLICT');
  }

  static tooManyRequests(mensaje = 'Demasiados intentos, prueba más tarde') {
    return new AppError(mensaje, 429, 'TOO_MANY_REQUESTS');
  }

  static internal(mensaje = 'Error interno del servidor') {
    return new AppError(mensaje, 500, 'INTERNAL_ERROR');
  }
}