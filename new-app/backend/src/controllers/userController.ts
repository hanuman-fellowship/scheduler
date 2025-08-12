import { Request, Response } from 'express';
import type { 
  CreateUserRequest, 
  UpdateUserRequest, 
  ResetPasswordRequest,
  UserRole
} from '@shared/types';
import {
  CreateUserFormSchema,
  UpdateUserFormSchema,
  ResetPasswordFormSchema
} from '@shared/types';
import * as userService from '../services/userService';

interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    roles: UserRole[];
  };
}

// GET /api/users - List all users
export const list = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch users',
        code: 'FETCH_ERROR'
      }
    });
  }
};

// GET /api/users/:id - Get user by ID
export const get = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      res.status(400).json({
        error: {
          message: 'Invalid user ID',
          code: 'VALIDATION_ERROR'
        }
      });
      return;
    }

    const user = await userService.getUserById(userId);
    
    if (!user) {
      res.status(404).json({
        error: {
          message: 'User not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch user',
        code: 'FETCH_ERROR'
      }
    });
  }
};

// POST /api/users - Create new user
export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Validate input using Zod schema
    const validationResult = CreateUserFormSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      res.status(400).json({
        error: {
          message: validationResult.error.errors[0].message,
          field: validationResult.error.errors[0].path[0],
          code: 'VALIDATION_ERROR'
        }
      });
      return;
    }

    const userData: CreateUserRequest = validationResult.data;
    const { user, tempPassword } = await userService.createUser(userData);

    // TODO: Send email with temporary password
    // For now, return the password in response (development only)
    res.status(201).json({
      ...user,
      tempPassword // Remove this in production
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({
        error: {
          message: error.message,
          code: 'DUPLICATE_USER'
        }
      });
      return;
    }

    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Failed to create user',
        code: 'CREATE_ERROR'
      }
    });
  }
};

// PUT /api/users/:id - Update user
export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      res.status(400).json({
        error: {
          message: 'Invalid user ID',
          code: 'VALIDATION_ERROR'
        }
      });
      return;
    }

    // Validate input using Zod schema
    const validationResult = UpdateUserFormSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      res.status(400).json({
        error: {
          message: validationResult.error.errors[0].message,
          field: validationResult.error.errors[0].path[0],
          code: 'VALIDATION_ERROR'
        }
      });
      return;
    }

    const userData: UpdateUserRequest = validationResult.data;
    const user = await userService.updateUser(userId, userData);

    res.json(user);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({
        error: {
          message: error.message,
          code: 'DUPLICATE_USER'
        }
      });
      return;
    }

    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({
        error: {
          message: error.message,
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Failed to update user',
        code: 'UPDATE_ERROR'
      }
    });
  }
};

// DELETE /api/users/:id - Delete user
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      res.status(400).json({
        error: {
          message: 'Invalid user ID',
          code: 'VALIDATION_ERROR'
        }
      });
      return;
    }

    await userService.deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({
        error: {
          message: error.message,
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Failed to delete user',
        code: 'DELETE_ERROR'
      }
    });
  }
};

// POST /api/users/reset-password - Reset user password
export const resetPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Validate input using Zod schema
    const validationResult = ResetPasswordFormSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      res.status(400).json({
        error: {
          message: validationResult.error.errors[0].message,
          field: validationResult.error.errors[0].path[0],
          code: 'VALIDATION_ERROR'
        }
      });
      return;
    }

    const { email }: ResetPasswordRequest = validationResult.data;
    const { user, newPassword } = await userService.resetPassword(email);

    // TODO: Send email with new password
    // For now, return the password in response (development only)
    res.json({
      message: 'Password reset successfully',
      user,
      newPassword // Remove this in production
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({
        error: {
          message: 'No user found with this email',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Failed to reset password',
        code: 'RESET_ERROR'
      }
    });
  }
};