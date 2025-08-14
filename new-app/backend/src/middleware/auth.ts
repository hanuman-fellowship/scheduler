import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../services/prisma';
import type { UserRole } from '@shared/types';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    roles: UserRole[];
  };
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: {
          message: 'Authorization token required',
          code: 'NO_TOKEN'
        }
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Get user with roles
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        roles: true
      }
    });

    if (!user) {
      res.status(401).json({
        error: {
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        }
      });
      return;
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map(r => r.name as UserRole)
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: {
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      }
    });
    return;
  }
};

export const requireRole = (role: UserRole | UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'NOT_AUTHENTICATED'
        }
      });
      return;
    }

    const allowedRoles = Array.isArray(role) ? role : [role];
    const hasPermission = allowedRoles.some(allowedRole => req.user!.roles.includes(allowedRole));

    if (!hasPermission) {
      res.status(403).json({
        error: {
          message: 'Insufficient permissions',
          code: 'FORBIDDEN'
        }
      });
      return;
    }

    next();
  };
};