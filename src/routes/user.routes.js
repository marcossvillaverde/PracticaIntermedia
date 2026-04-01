import { Router } from 'express';
import { register, validateEmail, login } from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  registerSchema,
  validationCodeSchema,
  loginSchema,
} from '../validators/user.validator.js';

const router = Router();

// Registro
router.post('/register', validate(registerSchema), register);

// Validación de email (requiere token)
router.put('/validation', authMiddleware, validate(validationCodeSchema), validateEmail);

// Login
router.post('/login', validate(loginSchema), login);

export default router;