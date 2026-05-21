export const ACCOUNT_CREATE_LIMIT = {
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiadas cuentas creadas. Intenta de nuevo en 1 hora.' },
  standardHeaders: true,
  legacyHeaders: false,
};
