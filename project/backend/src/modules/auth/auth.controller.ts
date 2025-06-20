import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '@/config/environment';
import { ApiResponse } from '@/types';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export class AuthController {
  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // In a real application, you would fetch the user from the database
    // For demo purposes, we'll use a mock user
    const mockUser = {
      id: '1',
      email: 'admin@mongarage.fr',
      password: await bcrypt.hash('password123', 10), // In real app, this would be stored hashed
      nom: 'Admin',
      prenom: 'Garage',
      role: 'ADMIN'
    };

    if (email !== mockUser.email) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, mockUser.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      {
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    logger.info(`User logged in: ${email}`);

    const response: ApiResponse = {
      success: true,
      data: {
        token,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          nom: mockUser.nom,
          prenom: mockUser.prenom,
          role: mockUser.role
        }
      },
      message: 'Login successful'
    };

    res.json(response);
  };

  register = async (req: Request, res: Response): Promise<void> => {
    // In a real application, you would create the user in the database
    throw new AppError('Registration not implemented', 501);
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    // In a real application, you would implement token refresh logic
    throw new AppError('Token refresh not implemented', 501);
  };
}