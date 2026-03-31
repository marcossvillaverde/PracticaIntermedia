import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { config } from '../config/index.js';

// Genera un access token de corta duración
export const generateAccessToken = (usuario) => {
  return jwt.sign(
    { _id: usuario._id, role: usuario.role },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpires }
  );
};

// Genera un refresh token aleatorio (no es JWT, es un token opaco)
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Verifica y decodifica un access token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch {
    return null;
  }
};