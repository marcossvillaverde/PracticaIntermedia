import { Router } from 'express';
import {
  register,
  validateEmail,
  login,
  refresh,
  logout,
  updatePersonalData,
  updateCompany,
  uploadLogo,
  getUser,
  deleteUser,
  changePassword,
} from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import authMiddleware from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.js';
import {
  registerSchema,
  validationCodeSchema,
  loginSchema,
  personalDataSchema,
  companyDataBodySchema,
  changePasswordSchema,
} from '../validators/user.validator.js';

const router = Router();

// Registro
router.post('/register', validate(registerSchema), register);

// Validacion de email
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

// Logo de la compañía
router.patch('/logo', authMiddleware, upload.single('logo'), uploadLogo);

// Obtener usuario autenticado
router.get('/', authMiddleware, getUser);

// Eliminar usuario
router.delete('/', authMiddleware, deleteUser);

// Cambiar contraseña
router.put('/password', authMiddleware, validate(changePasswordSchema), changePassword);

export default router;