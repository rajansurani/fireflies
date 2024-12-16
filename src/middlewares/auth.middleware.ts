import { Request, Response, NextFunction } from "express";
import { AuthService } from '../services/AuthService';
import { UnauthorizedError } from '../utils/errors';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

const authService = new AuthService();

export const authMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.replace('Bearer ', '');
    const { userId } = authService.verifyToken(token);
    req.userId = userId;
    next();
  } catch (error) {
    next(error instanceof Error ? error : new UnauthorizedError('Invalid token'));
  }
};
