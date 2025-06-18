import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '@/middleware/errorHandler';

export const validationMiddleware = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      throw new AppError('Validation failed', 400);
    }

    next();
  };
};

// Common validation schemas
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

export const clientSchema = Joi.object({
  prenom: Joi.string().required().min(2).max(50),
  nom: Joi.string().required().min(2).max(50),
  entreprise: Joi.string().optional().allow('').max(100),
  telephone: Joi.string().required().pattern(/^[0-9\.\-\s\+]+$/),
  email: Joi.string().email().required(),
  adresse: Joi.string().required().max(200),
  ville: Joi.string().required().max(50),
  codePostal: Joi.string().required().pattern(/^[0-9]{5}$/),
  typeClient: Joi.string().valid('NORMAL', 'GRAND_COMPTE').default('NORMAL')
});

export const vehiculeSchema = Joi.object({
  immatriculation: Joi.string().required().pattern(/^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/),
  marque: Joi.string().required().min(2).max(50),
  modele: Joi.string().required().min(1).max(50),
  annee: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1),
  numeroSerie: Joi.string().optional().allow('').max(50),
  kilometrage: Joi.number().integer().min(0).optional(),
  clientId: Joi.string().required()
});

export const prestationSchema = Joi.object({
  nom: Joi.string().required().min(2).max(100),
  description: Joi.string().required().min(5).max(500),
  typeService: Joi.string().valid('CARROSSERIE', 'MECANIQUE').required(),
  prixDeBase: Joi.number().positive().required()
});