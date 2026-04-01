import { AppError } from '../utils/AppError.js';

// Verifica que el usuario tiene uno de los roles permitidos
// Debe usarse siempre después de authMiddleware
const checkRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return next(AppError.unauthorized('No autenticado'));
  }

  if (!roles.includes(req.user.role)) {
    return next(AppError.forbidden('No tienes permisos para realizar esta acción'));
  }

  next();
};

export default checkRole;