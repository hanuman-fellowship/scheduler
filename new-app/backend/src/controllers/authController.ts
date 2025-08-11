import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../services/prisma';
import { LoginRequestSchema, ChangePasswordRequestSchema } from '@shared/types';
import type { UserRole } from '@shared/types';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    roles: UserRole[];
  };
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = LoginRequestSchema.parse(req.body);
    
    // Find user with roles
    const user = await prisma.user.findUnique({
      where: { username: validatedData.username },
      include: {
        roles: true
      }
    });

    if (!user) {
      res.status(401).json({
        error: {
          message: 'Invalid username or password',
          code: 'INVALID_CREDENTIALS'
        }
      });
      return;
    }

    // Check password
    const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
    if (!isValidPassword) {
      res.status(401).json({
        error: {
          message: 'Invalid username or password',
          code: 'INVALID_CREDENTIALS'
        }
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map(r => r.name as UserRole)
    };

    res.json({
      token,
      user: userResponse
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError' && 'errors' in error) {
      const zodError = error as { errors: Array<{ path: string[] }> };
      res.status(400).json({
        error: {
          message: 'Validation error',
          field: zodError.errors[0]?.path[0],
          code: 'VALIDATION_ERROR'
        }
      });
      return;
    }
    throw error;
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  // JWT tokens are stateless, so logout is handled on client side
  // Could implement token blacklisting here if needed
  res.status(204).send();
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = ChangePasswordRequestSchema.parse(req.body);
    
    if (!req.user) {
      res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'NOT_AUTHENTICATED'
        }
      });
      return;
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      res.status(404).json({
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
      return;
    }

    // Verify old password
    const isValidOldPassword = await bcrypt.compare(validatedData.oldPassword, user.password);
    if (!isValidOldPassword) {
      res.status(400).json({
        error: {
          message: 'Current password is incorrect',
          field: 'oldPassword',
          code: 'INVALID_PASSWORD'
        }
      });
      return;
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword }
    });

    res.status(204).send();
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError' && 'errors' in error) {
      const zodError = error as { errors: Array<{ path: string[] }> };
      res.status(400).json({
        error: {
          message: 'Validation error',
          field: zodError.errors[0]?.path[0],
          code: 'VALIDATION_ERROR'
        }
      });
      return;
    }
    throw error;
  }
};