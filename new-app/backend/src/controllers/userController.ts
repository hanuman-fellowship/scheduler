import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../services/prisma';
import type { UserRole } from '@shared/types';

interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    roles: UserRole[];
  };
}

export const list = async (req: AuthRequest, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({
    include: {
      roles: true
    },
    orderBy: { username: 'asc' }
  });

  const userResponses = users.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles.map(r => r.name as UserRole)
  }));

  res.json(userResponses);
};

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  const { username, email, roles } = req.body;

  // Basic validation
  if (!username || !email || !roles || !Array.isArray(roles)) {
    res.status(400).json({
      error: {
        message: 'Missing required fields: username, email, roles',
        code: 'VALIDATION_ERROR'
      }
    });
    return;
  }

  // Check for existing user
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }]
    }
  });

  if (existingUser) {
    res.status(409).json({
      error: {
        message: existingUser.username === username ? 'Username already exists' : 'Email already exists',
        code: 'DUPLICATE_USER'
      }
    });
    return;
  }

  // Generate simple temp password for proof of concept
  const tempPassword = 'password123';
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  // Create user with roles
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      roles: {
        create: roles.map((role: UserRole) => ({ name: role }))
      }
    },
    include: {
      roles: true
    }
  });

  res.status(201).json({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles.map(r => r.name as UserRole)
  });
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);
  // Simple update for now - just implement what we need
  res.status(501).json({ error: { message: 'Not implemented yet', code: 'NOT_IMPLEMENTED' } });
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);

  await prisma.user.delete({
    where: { id: userId }
  });

  res.status(204).send();
};