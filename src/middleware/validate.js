// Middleware genérico de validación con Zod
// Valida body, query y params contra el schema recibido

export const validate = (schema) => (req, res, next) => {
  try {
    const resultado = schema.parse({
      body:   req.body,
      query:  req.query,
      params: req.params,
    });
    // Sobreescribimos req.body con los datos transformados por Zod
    // (por ejemplo el email ya vendrá en minúsculas)
    req.body = resultado.body ?? req.body;
    next();
  } catch (error) {
    const errores = error.errors.map((e) => ({
      campo:   e.path.join('.'),
      mensaje: e.message,
    }));
    res.status(400).json({
      error:    true,
      mensaje:  'Error de validación',
      detalles: errores,
    });
  }
};