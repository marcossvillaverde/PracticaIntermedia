import User from '../models/User.js';
import Company from '../models/Company.js';
import { encrypt, compare } from '../utils/handlePassword.js';
import { generateAccessToken, generateRefreshToken } from '../utils/handleJwt.js';
import { AppError } from '../utils/AppError.js';
import notificationService from '../services/notification.service.js';
import { config } from '../config/index.js';

// Genera un código aleatorio de 6 dígitos
const generarCodigo = () => String(Math.floor(100000 + Math.random() * 900000));

// Devuelve tokens + datos del usuario (sin password)
const respuestaConTokens = (res, statusCode, usuario, refreshToken) => {
  const accessToken = generateAccessToken(usuario);
  res.status(statusCode).json({
    accessToken,
    refreshToken,
    usuario: {
      _id:      usuario._id,
      email:    usuario.email,
      role:     usuario.role,
      status:   usuario.status,
      fullName: usuario.fullName,
    },
  });
};

// POST /api/user/register
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Comprobar si ya existe un usuario verificado con ese email
    const existente = await User.findOne({ email, status: 'verified' });
    if (existente) {
      return next(AppError.conflict('Ya existe una cuenta verificada con ese email'));
    }

    const passwordHash = await encrypt(password);
    const verificationCode = generarCodigo();

    const usuario = await User.create({
      email,
      password:             passwordHash,
      verificationCode,
      verificationAttempts: 3,
    });

    const refreshToken = generateRefreshToken();
    usuario.refreshToken = refreshToken;
    await usuario.save();

    notificationService.emit('user:registered', { email, verificationCode });

    respuestaConTokens(res, 201, usuario, refreshToken);
  } catch (err) {
    next(err);
  }
};

// PUT /api/user/validation
export const validateEmail = async (req, res, next) => {
  try {
    const { code } = req.body;
    const usuario = await User.findById(req.user._id);

    if (usuario.status === 'verified') {
      return res.json({ mensaje: 'El email ya estaba verificado' });
    }

    if (usuario.verificationAttempts <= 0) {
      return next(AppError.tooManyRequests('Has agotado los intentos de verificación'));
    }

    if (usuario.verificationCode !== code) {
      usuario.verificationAttempts -= 1;
      await usuario.save();
      return next(
        AppError.badRequest(
          `Código incorrecto. Te quedan ${usuario.verificationAttempts} intentos`
        )
      );
    }

    usuario.status = 'verified';
    usuario.verificationCode = undefined;
    await usuario.save();

    notificationService.emit('user:verified', { email: usuario.email });

    res.json({ mensaje: 'Email verificado correctamente' });
  } catch (err) {
    next(err);
  }
};

// POST /api/user/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usuario = await User.findOne({ email, deleted: false }).select('+password');

    if (!usuario) {
      return next(AppError.unauthorized('Credenciales incorrectas'));
    }

    const passwordOk = await compare(password, usuario.password);
    if (!passwordOk) {
      return next(AppError.unauthorized('Credenciales incorrectas'));
    }

    const refreshToken = generateRefreshToken();
    usuario.refreshToken = refreshToken;
    await usuario.save();

    respuestaConTokens(res, 200, usuario, refreshToken);
  } catch (err) {
    next(err);
  }
};

// PUT /api/user/register (datos personales
export const updatePersonalData = async (req, res, next) => {
  try {
    const { name, lastName, nif, address } = req.body;

    const usuario = await User.findByIdAndUpdate(
      req.user._id,
      { name, lastName, nif, address },
      { new: true, runValidators: true }
    );

    res.json({ mensaje: 'Datos personales actualizados', usuario });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/user/company
export const updateCompany = async (req, res, next) => {
  try {
    const usuario = await User.findById(req.user._id);
    const { isFreelance, name, cif, address } = req.body;

    let cifFinal = cif;
    let nombreFinal = name;
    let direccionFinal = address;

    // Si es autónomo, usamos sus datos personales
    if (isFreelance) {
      cifFinal = usuario.nif;
      nombreFinal = `${usuario.name} ${usuario.lastName}`;
      direccionFinal = usuario.address;
    }

    // Buscar si ya existe una compañía con ese CIF
    let company = await Company.findOne({ cif: cifFinal, deleted: false });

    if (company) {
      // Ya existe -> el usuario se une como guest
      usuario.role = 'guest';
    } else {
      // No existe -> crear nueva compañía
      company = await Company.create({
        owner: usuario._id,
        name: nombreFinal,
        cif: cifFinal,
        address: direccionFinal,
        isFreelance: isFreelance ?? false,
      });
    }

    usuario.company = company._id;
    await usuario.save();

    res.json({ mensaje: 'Compañía asignada correctamente', company });
  } catch (err) {
    next(err);
  }
};