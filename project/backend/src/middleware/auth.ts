import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/environment';
import { AppError } from '@/middleware/errorHandler';
import { JwtPayload, AuthUser } from '@/types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Access denied. No token provided.', 401);
    }

    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    
    // In a real application, you might want to fetch the user from the database
    // to ensure they still exist and have the correct permissions
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      nom: '',
      prenom: '',
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token.', 401);
    }
    throw error;
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions.', 403);
    }

    next();
  };
};