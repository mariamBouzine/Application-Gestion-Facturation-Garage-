import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validationMiddleware } from '@/middleware/validation';
import Joi from 'joi';

const router = Router();
const authController = new AuthController();

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  nom: Joi.string().required(),
  prenom: Joi.string().required()
});

// POST /api/auth/login
router.post('/login', validationMiddleware(loginSchema), authController.login);

// POST /api/auth/register
router.post('/register', validationMiddleware(registerSchema), authController.register);

// POST /api/auth/refresh
router.post('/refresh', authController.refreshToken);

export default router;