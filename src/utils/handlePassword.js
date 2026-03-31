import bcrypt from 'bcryptjs';

// Encripta una contraseña en texto plano
export const encrypt = async (contraseña) => {
  const hash = await bcrypt.hash(contraseña, 10);
  return hash;
};

// Compara una contraseña en texto plano con su hash
export const compare = async (contraseña, hash) => {
  const resultado = await bcrypt.compare(contraseña, hash);
  return resultado;
};