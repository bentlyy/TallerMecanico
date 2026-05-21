import { Response, NextFunction } from 'express';
import Joi from 'joi';
import { AuthRequest } from './authMiddleware';

type ValidationSchemas = {
  body?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
};

export function validate(schemas: ValidationSchemas) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, { abortEarly: false, stripUnknown: true });
      if (error) {
        res.status(400).json({
          error: 'Datos inválidos',
          details: error.details.map((d) => ({ field: d.path.join('.'), message: d.message })),
        });
        return;
      }
      req.body = value;
    }

    if (schemas.params) {
      const { error } = schemas.params.validate(req.params);
      if (error) {
        res.status(400).json({ error: 'Parámetros inválidos', details: error.details.map((d) => d.message) });
        return;
      }
    }

    if (schemas.query) {
      const { error } = schemas.query.validate(req.query);
      if (error) {
        res.status(400).json({ error: 'Query inválida', details: error.details.map((d) => d.message) });
        return;
      }
    }

    next();
  };
}

export const schemas = {
  id: Joi.object({ id: Joi.number().integer().positive().required() }),

  cliente: {
    create: Joi.object({
      nombre: Joi.string().trim().min(1).max(100).required(),
      email: Joi.string().email().max(100).required(),
      telefono: Joi.string().trim().max(20).allow('', null).optional(),
      direccion: Joi.string().trim().max(200).allow('', null).optional(),
    }),
    update: Joi.object({
      nombre: Joi.string().trim().min(1).max(100).optional(),
      email: Joi.string().email().max(100).optional(),
      telefono: Joi.string().trim().max(20).allow('', null).optional(),
      direccion: Joi.string().trim().max(200).allow('', null).optional(),
    }),
  },

  vehiculo: {
    create: Joi.object({
      marca: Joi.string().trim().min(1).max(50).required(),
      modelo: Joi.string().trim().min(1).max(50).required(),
      anio: Joi.number().integer().min(1900).max(2030).optional().allow(null),
      patente: Joi.string().trim().min(2).max(20).required(),
      kilometraje: Joi.number().integer().min(0).optional().allow(null),
      clienteId: Joi.number().integer().positive().required(),
    }),
    update: Joi.object({
      marca: Joi.string().trim().min(1).max(50).optional(),
      modelo: Joi.string().trim().min(1).max(50).optional(),
      anio: Joi.number().integer().min(1900).max(2030).optional().allow(null),
      patente: Joi.string().trim().min(2).max(20).optional(),
      kilometraje: Joi.number().integer().min(0).optional().allow(null),
      clienteId: Joi.number().integer().positive().optional(),
    }),
  },

  reparacion: {
    create: Joi.object({
      descripcion: Joi.string().trim().min(1).max(1000).required(),
      costoManoObra: Joi.number().min(0).optional().default(0),
      vehiculoId: Joi.number().integer().positive().required(),
      mecanicoId: Joi.number().integer().positive().optional().allow(null),
      recepcionistaId: Joi.number().integer().positive().required(),
    }),
    update: Joi.object({
      descripcion: Joi.string().trim().min(1).max(1000).optional(),
      costoManoObra: Joi.number().min(0).optional(),
      vehiculoId: Joi.number().integer().positive().optional(),
      mecanicoId: Joi.number().integer().positive().optional().allow(null),
      recepcionistaId: Joi.number().integer().positive().optional(),
    }),
  },

  pieza: {
    create: Joi.object({
      nombre: Joi.string().trim().min(1).max(100).required(),
      marca: Joi.string().trim().max(50).allow('', null).optional(),
      precio: Joi.number().min(0).required(),
      stock: Joi.number().integer().min(0).optional().default(0),
      codigo: Joi.string().trim().min(1).max(50).required(),
    }),
    update: Joi.object({
      nombre: Joi.string().trim().min(1).max(100).optional(),
      marca: Joi.string().trim().max(50).allow('', null).optional(),
      precio: Joi.number().min(0).optional(),
      stock: Joi.number().integer().min(0).optional(),
      codigo: Joi.string().trim().min(1).max(50).optional(),
    }),
  },

  usuario: {
    create: Joi.object({
      email: Joi.string().email().max(100).required(),
      password: Joi.string()
        .min(8)
        .max(128)
        .required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .messages({
          'string.min': 'La contraseña debe tener al menos 8 caracteres',
          'string.pattern.base': 'La contraseña debe tener mayúsculas, minúsculas y números',
        }),
      nombre: Joi.string().trim().min(1).max(100).required(),
      rolId: Joi.number().integer().positive().required(),
    }),
    update: Joi.object({
      email: Joi.string().email().max(100).optional(),
      password: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .messages({
          'string.min': 'La contraseña debe tener al menos 8 caracteres',
          'string.pattern.base': 'La contraseña debe tener mayúsculas, minúsculas y números',
        })
        .optional(),
      nombre: Joi.string().trim().min(1).max(100).optional(),
      rolId: Joi.number().integer().positive().optional(),
    }),
  },

  login: Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().required().messages({
      'any.required': 'La contraseña es requerida',
    }),
  }),

  factura: {
    create: Joi.object({
      clienteId: Joi.number().integer().positive().required(),
      reparacionId: Joi.number().integer().positive().required(),
      total: Joi.number().min(0).required(),
    }),
  },

  mecanico: {
    create: Joi.object({
      usuarioId: Joi.number().integer().positive().required(),
      especialidad: Joi.string().trim().max(100).allow('', null).optional(),
    }),
    update: Joi.object({
      especialidad: Joi.string().trim().max(100).allow('', null).optional(),
    }),
  },

  rol: {
    create: Joi.object({
      nombre: Joi.string().trim().min(1).max(50).required(),
      permisos: Joi.object().required(),
    }),
    update: Joi.object({
      nombre: Joi.string().trim().min(1).max(50).optional(),
      permisos: Joi.object().optional(),
    }),
  },

  detalleReparacion: {
    create: Joi.object({
      reparacionId: Joi.number().integer().positive().required(),
      piezaId: Joi.number().integer().positive().required(),
      cantidad: Joi.number().integer().min(1).required(),
      precioUnitario: Joi.number().min(0).required(),
      descripcion: Joi.string().trim().max(500).allow('', null).optional(),
    }),
    update: Joi.object({
      cantidad: Joi.number().integer().min(1).optional(),
      precioUnitario: Joi.number().min(0).optional(),
      descripcion: Joi.string().trim().max(500).allow('', null).optional(),
    }),
  },
};
