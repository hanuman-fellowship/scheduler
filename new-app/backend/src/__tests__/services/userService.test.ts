import { describe, it, expect, beforeEach } from '@jest/globals';
import { 
  createTestUser, 
  createTestArea,
  createTestSchedule,
  resetTestDatabase, 
  prisma 
} from '../utils/testDbOptimized';
import * as userService from '../../services/userService';
import type { CreateUserRequest, UpdateUserRequest } from '@shared/types';

// Helper to get a default schedule for testing
const getDefaultSchedule = async () => {
  // Try to find existing schedule or create one
  let schedule = await prisma.schedule.findFirst();
  if (!schedule) {
    schedule = await createTestSchedule({ name: 'Test Schedule' });
  }
  return schedule;
};

// Helper to create user with area management functionality
const createUser = async ({ username, email, roles, areaIds }: { 
  username: string; 
  email: string; 
  roles: string[]; 
  areaIds?: number[] 
}) => {
  const user = await createTestUser({ username, email, roles });
  
  // If areaIds provided, create manager relationships
  if (areaIds && areaIds.length > 0) {
    await prisma.manager.createMany({
      data: areaIds.map(areaId => ({
        userId: user.id,
        areaId: areaId
      }))
    });
  }
  
  return user;
};

describe('userService', () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  describe('generateRandomPassword', () => {
    it('should generate password of specified length', () => {
      const password = userService.generateRandomPassword(10);
      expect(password).toHaveLength(10);
    });

    it('should generate different passwords on each call', () => {
      const password1 = userService.generateRandomPassword();
      const password2 = userService.generateRandomPassword();
      expect(password1).not.toBe(password2);
    });
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'testpassword';
      const hashed = await userService.hashPassword(password);
      
      expect(hashed).not.toBe(password);
      expect(hashed).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash format
    });
  });

  describe('checkUserExists', () => {
    beforeEach(async () => {
      await createUser({
        username: 'testuser',
        email: 'test@example.com',
        roles: ['operations']
      });
    });

    it('should return existing user when username matches', async () => {
      const existingUser = await userService.checkUserExists('testuser', 'other@example.com');
      expect(existingUser).toBeTruthy();
      expect(existingUser?.username).toBe('testuser');
    });

    it('should return existing user when email matches', async () => {
      const existingUser = await userService.checkUserExists('otheruser', 'test@example.com');
      expect(existingUser).toBeTruthy();
      expect(existingUser?.email).toBe('test@example.com');
    });

    it('should return null when no match', async () => {
      const existingUser = await userService.checkUserExists('newuser', 'new@example.com');
      expect(existingUser).toBeNull();
    });

    it('should exclude specified user ID', async () => {
      const user = await createUser({
        username: 'testuser2',
        email: 'test2@example.com',
        roles: ['manager']
      });

      const existingUser = await userService.checkUserExists('testuser2', 'test2@example.com', user.id);
      expect(existingUser).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return empty array when no users exist', async () => {
      const users = await userService.getAllUsers();
      expect(users).toEqual([]);
    });

    it('should return all users with roles and areas', async () => {
      const schedule = await getDefaultSchedule();
      const area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' });
      
      await createUser({
        username: 'ops',
        email: 'ops@example.com',
        roles: ['operations']
      });

      await createUser({
        username: 'manager',
        email: 'manager@example.com',
        roles: ['manager'],
        areaIds: [area.id]
      });

      const users = await userService.getAllUsers();
      
      // Filter to only the users we created for this test
      const testUsers = users.filter(u => ['manager', 'ops'].includes(u.username));
      
      expect(testUsers).toHaveLength(2);
      
      const managerUser = testUsers.find(u => u.username === 'manager');
      const opsUser = testUsers.find(u => u.username === 'ops');
      
      expect(managerUser).toBeDefined();
      expect(managerUser?.roles).toEqual(['manager']);
      expect(managerUser?.areas).toHaveLength(1);
      expect(managerUser?.areas?.[0].name).toBe('Kitchen');

      expect(opsUser).toBeDefined();
      expect(opsUser?.roles).toEqual(['operations']);
      expect(opsUser?.areas).toEqual([]);
    });
  });

  describe('getUserById', () => {
    it('should return null for non-existent user', async () => {
      const user = await userService.getUserById(999);
      expect(user).toBeNull();
    });

    it('should return user with full details', async () => {
      const createdUser = await createUser({
        username: 'testuser',
        email: 'test@example.com',
        roles: ['personnel']
      });

      const user = await userService.getUserById(createdUser.id);

      expect(user).toBeTruthy();
      expect(user?.username).toBe('testuser');
      expect(user?.email).toBe('test@example.com');
      expect(user?.roles).toEqual(['personnel']);
      expect(user?.areas).toEqual([]);
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData: CreateUserRequest = {
        username: 'newuser',
        email: 'new@example.com',
        roles: ['operations']
      };

      const result = await userService.createUser(userData);

      expect(result.user.username).toBe('newuser');
      expect(result.user.email).toBe('new@example.com');
      expect(result.user.roles).toEqual(['operations']);
      expect(result.tempPassword).toBeTruthy();
      expect(result.tempPassword).toHaveLength(8);
    });

    it('should create user with area assignments', async () => {
      const schedule = await getDefaultSchedule();
      const area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' });

      const userData: CreateUserRequest = {
        username: 'manager',
        email: 'manager@example.com',
        roles: ['manager'],
        areaIds: [area.id]
      };

      const result = await userService.createUser(userData);

      expect(result.user.areas).toHaveLength(1);
      expect(result.user.areas?.[0].name).toBe('Kitchen');
    });

    it('should throw error for duplicate username', async () => {
      await createUser({
        username: 'duplicate',
        email: 'first@example.com',
        roles: ['operations']
      });

      const userData: CreateUserRequest = {
        username: 'duplicate',
        email: 'second@example.com',
        roles: ['manager']
      };

      await expect(userService.createUser(userData)).rejects.toThrow('Username already exists');
    });

    it('should throw error for duplicate email', async () => {
      await createUser({
        username: 'first',
        email: 'duplicate@example.com',
        roles: ['operations']
      });

      const userData: CreateUserRequest = {
        username: 'second',
        email: 'duplicate@example.com',
        roles: ['manager']
      };

      await expect(userService.createUser(userData)).rejects.toThrow('Email already exists');
    });
  });

  describe('updateUser', () => {
    let existingUser: any;

    beforeEach(async () => {
      existingUser = await createUser({
        username: 'original',
        email: 'original@example.com',
        roles: ['personnel']
      });
    });

    it('should update username successfully', async () => {
      const updateData: UpdateUserRequest = {
        username: 'updated'
      };

      const result = await userService.updateUser(existingUser.id, updateData);

      expect(result.username).toBe('updated');
      expect(result.email).toBe('original@example.com'); // Unchanged
    });

    it('should update roles successfully', async () => {
      const updateData: UpdateUserRequest = {
        roles: ['operations', 'manager']
      };

      const result = await userService.updateUser(existingUser.id, updateData);

      expect(result.roles).toEqual(['operations', 'manager']);
    });

    it('should update area assignments', async () => {
      const schedule = await getDefaultSchedule();
      const area1 = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' });
      const area2 = await createTestArea(schedule.id, { name: 'Dining', shortName: 'D' });

      const updateData: UpdateUserRequest = {
        areaIds: [area1.id, area2.id]
      };

      const result = await userService.updateUser(existingUser.id, updateData);

      expect(result.areas).toHaveLength(2);
      expect(result.areas?.map(a => a.name).sort()).toEqual(['Dining', 'Kitchen']);
    });

    it('should throw error for non-existent user', async () => {
      const updateData: UpdateUserRequest = {
        username: 'updated'
      };

      await expect(userService.updateUser(999, updateData)).rejects.toThrow('User not found');
    });

    it('should throw error for duplicate username', async () => {
      await createUser({
        username: 'taken',
        email: 'taken@example.com',
        roles: ['operations']
      });

      const updateData: UpdateUserRequest = {
        username: 'taken'
      };

      await expect(userService.updateUser(existingUser.id, updateData)).rejects.toThrow('Username already exists');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const user = await createUser({
        username: 'todelete',
        email: 'delete@example.com',
        roles: ['personnel']
      });

      await userService.deleteUser(user.id);

      const deletedUser = await userService.getUserById(user.id);
      expect(deletedUser).toBeNull();
    });

    it('should throw error for non-existent user', async () => {
      await expect(userService.deleteUser(999)).rejects.toThrow('User not found');
    });
  });

  describe('resetPassword', () => {
    let existingUser: any;

    beforeEach(async () => {
      existingUser = await createUser({
        username: 'resettest',
        email: 'reset@example.com',
        roles: ['operations']
      });
    });

    it('should reset password successfully', async () => {
      const result = await userService.resetPassword('reset@example.com');

      expect(result.user.email).toBe('reset@example.com');
      expect(result.newPassword).toBeTruthy();
      expect(result.newPassword).toHaveLength(8);
    });

    it('should throw error for non-existent email', async () => {
      await expect(userService.resetPassword('nonexistent@example.com')).rejects.toThrow('User not found');
    });
  });
});