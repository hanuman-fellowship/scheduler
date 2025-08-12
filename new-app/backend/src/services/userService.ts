import bcrypt from 'bcryptjs';
import prisma from './prisma';
import type { 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserListResponse,
  UserRole 
} from '@shared/types';

// Helper function to generate random password
export const generateRandomPassword = (length: number = 8): string => {
  const chars = '0123456789bcdfghjkmnpqrstvwxyzBCDFGHJKMNPQRSTVWXYZ';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Helper function to hash password
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

// Check if username or email already exists
export const checkUserExists = async (username: string, email: string, excludeId?: number) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      AND: [
        excludeId ? { id: { not: excludeId } } : {},
        {
          OR: [{ username }, { email }]
        }
      ]
    }
  });

  return existingUser;
};

// Get all users with their roles and areas
export const getAllUsers = async (): Promise<UserListResponse[]> => {
  const users = await prisma.user.findMany({
    include: {
      roles: true,
      managers: {
        include: {
          area: true
        }
      }
    },
    orderBy: { username: 'asc' }
  });

  return users.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles.map(r => r.name as UserRole),
    areas: user.managers.map(m => ({
      id: m.area.id,
      name: m.area.name,
      shortName: m.area.shortName,
      shifts: [], // Not needed for user list
      floatingShifts: [] // Not needed for user list
    })),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  }));
};

// Get single user by ID
export const getUserById = async (id: number): Promise<UserListResponse | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      roles: true,
      managers: {
        include: {
          area: true
        }
      }
    }
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles.map(r => r.name as UserRole),
    areas: user.managers.map(m => ({
      id: m.area.id,
      name: m.area.name,
      shortName: m.area.shortName,
      shifts: [],
      floatingShifts: []
    })),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
};

// Create new user
export const createUser = async (userData: CreateUserRequest): Promise<{ user: UserListResponse; tempPassword: string }> => {
  const { username, email, roles, areaIds = [] } = userData;

  // Check for existing user
  const existingUser = await checkUserExists(username, email);
  if (existingUser) {
    throw new Error(existingUser.username === username ? 'Username already exists' : 'Email already exists');
  }

  // Generate temporary password
  const tempPassword = generateRandomPassword();
  const hashedPassword = await hashPassword(tempPassword);

  // Create user with roles and area assignments
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      roles: {
        create: roles.map((role: UserRole) => ({ name: role }))
      },
      managers: areaIds.length > 0 ? {
        create: areaIds.map(areaId => ({ areaId }))
      } : undefined
    },
    include: {
      roles: true,
      managers: {
        include: {
          area: true
        }
      }
    }
  });

  const userResponse: UserListResponse = {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles.map(r => r.name as UserRole),
    areas: user.managers.map(m => ({
      id: m.area.id,
      name: m.area.name,
      shortName: m.area.shortName,
      shifts: [],
      floatingShifts: []
    })),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };

  return { user: userResponse, tempPassword };
};

// Update user
export const updateUser = async (id: number, userData: UpdateUserRequest): Promise<UserListResponse> => {
  const { username, email, roles, areaIds } = userData;

  // First check if user exists
  const existingUserById = await prisma.user.findUnique({ where: { id } });
  if (!existingUserById) {
    throw new Error('User not found');
  }

  // Check for existing user with same username/email (excluding current user)
  if (username || email) {
    const duplicateUser = await checkUserExists(username || '', email || '', id);
    if (duplicateUser) {
      throw new Error(duplicateUser.username === username ? 'Username already exists' : 'Email already exists');
    }
  }

  // Update user in transaction to handle roles and areas
  const updatedUser = await prisma.$transaction(async (tx) => {
    // Update basic user data
    const user = await tx.user.update({
      where: { id },
      data: {
        ...(username && { username }),
        ...(email && { email }),
      }
    });

    // Update roles if provided
    if (roles) {
      // Delete existing roles
      await tx.role.deleteMany({
        where: { userId: id }
      });

      // Create new roles
      await tx.role.createMany({
        data: roles.map(role => ({ userId: id, name: role }))
      });
    }

    // Update area assignments if provided
    if (areaIds !== undefined) {
      // Delete existing assignments
      await tx.manager.deleteMany({
        where: { userId: id }
      });

      // Create new assignments
      if (areaIds.length > 0) {
        await tx.manager.createMany({
          data: areaIds.map(areaId => ({ userId: id, areaId }))
        });
      }
    }

    // Return updated user with relationships
    return tx.user.findUnique({
      where: { id },
      include: {
        roles: true,
        managers: {
          include: {
            area: true
          }
        }
      }
    });
  });

  if (!updatedUser) {
    throw new Error('User not found');
  }

  return {
    id: updatedUser.id,
    username: updatedUser.username,
    email: updatedUser.email,
    roles: updatedUser.roles.map(r => r.name as UserRole),
    areas: updatedUser.managers.map(m => ({
      id: m.area.id,
      name: m.area.name,
      shortName: m.area.shortName,
      shifts: [],
      floatingShifts: []
    })),
    createdAt: updatedUser.createdAt.toISOString(),
    updatedAt: updatedUser.updatedAt.toISOString()
  };
};

// Delete user
export const deleteUser = async (id: number): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error('User not found');
  }

  await prisma.user.delete({
    where: { id }
  });
};

// Reset user password
export const resetPassword = async (email: string): Promise<{ user: UserListResponse; newPassword: string }> => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      roles: true,
      managers: {
        include: {
          area: true
        }
      }
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const newPassword = generateRandomPassword();
  const hashedPassword = await hashPassword(newPassword);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
    include: {
      roles: true,
      managers: {
        include: {
          area: true
        }
      }
    }
  });

  const userResponse: UserListResponse = {
    id: updatedUser.id,
    username: updatedUser.username,
    email: updatedUser.email,
    roles: updatedUser.roles.map(r => r.name as UserRole),
    areas: updatedUser.managers.map(m => ({
      id: m.area.id,
      name: m.area.name,
      shortName: m.area.shortName,
      shifts: [],
      floatingShifts: []
    })),
    createdAt: updatedUser.createdAt.toISOString(),
    updatedAt: updatedUser.updatedAt.toISOString()
  };

  return { user: userResponse, newPassword };
};