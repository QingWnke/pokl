import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export const requireAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication required'));
  }

  try {
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, env.jwtSecret) as AuthenticatedRequest['admin'];
    req.admin = decoded;
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return next(new ApiError(403, 'Insufficient permissions'));
    }
    next();
  };
};
