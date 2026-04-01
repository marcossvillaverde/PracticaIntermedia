import { Router } from 'express';
import {
  register,
  validateEmail,
  login,
  refresh,
  logout,
  updatePersonalData,
  updateCompany,
} from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  registerSchema,
  validationCodeSchema,
  loginSchema,
  personalDataSchema,
  companyDataBodySchema,
} from '../validators/user.validator.js';

const router = Router();

// Registro
router.post('/register', validate(registerSchema), register);

// Validación de email
router.put('/validation', authMiddleware, validate(validationCodeSchema), validateEmail);

// Login
router.post('/login', validate(loginSchema), login);

// Refresh token
router.post('/refresh', refresh);

// Logout
router.post('/logout', authMiddleware, logout);

// Onboarding —> datos personales
router.put('/register', authMiddleware, validate(personalDataSchema), updatePersonalData);

// Onboarding —> datos de compañía
router.patch('/company', authMiddleware, validate(companyDataBodySchema), updateCompany);

export default router;