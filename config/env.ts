import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(16).required().messages({
    'string.min': 'JWT_SECRET debe tener al menos 16 caracteres',
    'any.required': 'JWT_SECRET es requerido',
  }),
  CORS_ORIGIN: Joi.string().default('http://localhost:3043'),
  LOG_LEVEL: Joi.string().valid('trace', 'debug', 'info', 'warn', 'error', 'fatal').default('info'),
  API_VERSION: Joi.string().default('v1'),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  jwtSecret: envVars.JWT_SECRET,
  corsOrigin: envVars.CORS_ORIGIN,
  logLevel: envVars.LOG_LEVEL,
  apiVersion: envVars.API_VERSION,
};
