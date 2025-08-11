import { getSchedulesForUser, getScheduleDetail, deleteSchedule } from '../../services/scheduleService';
import { createTestUser, createTestSchedule, resetTestDatabase } from '../utils/testDbOptimized';

describe('ScheduleService', () => {
  let operationsUser: any;
  let regularUser: any;
  let testSchedule: any;

  beforeEach(async () => {
    // Reset database before each test for clean state
    await resetTestDatabase();
    
    // Create test users for each test
    const operationsUserData = await createTestUser({
      username: 'operations_user',
      email: 'operations@example.com',
      password: 'password123',
      roles: ['operations']
    });

    const regularUserData = await createTestUser({
      username: 'regular_user',
      email: 'regular@example.com',
      password: 'password123',
      roles: ['personnel']
    });

    // Convert to AuthUser format expected by service
    // Note: The service expects roles to be an array, but the database stores them in a separate table
    // We'll need to fetch the roles separately or modify the service to handle this
    operationsUser = {
      id: operationsUserData.id,
      username: operationsUserData.username,
      email: operationsUserData.email,
      roles: ['operations' as const] // Hardcode for test since we know what was created
    };

    regularUser = {
      id: regularUserData.id,
      username: regularUserData.username,
      email: regularUserData.email,
      roles: ['personnel' as const] // Hardcode for test since we know what was created
    };

    // Create test schedule
    testSchedule = await createTestSchedule({
      name: 'Test Schedule',
      userId: regularUser.id,
      template: false,
      request: 0
    });
  });

  describe('getSchedulesForUser', () => {
    it('should return schedules for regular user', async () => {
      const result = await getSchedulesForUser(regularUser);

      expect(result).toHaveProperty('mine');
      expect(result).not.toHaveProperty('all');
      expect(result.mine).toHaveLength(1);
      expect(result.mine[0].name).toBe('Test Schedule');
    });

    it('should return all schedules for operations user', async () => {
      const result = await getSchedulesForUser(operationsUser);

      expect(result).toHaveProperty('mine');
      expect(result).toHaveProperty('all');
      expect(result.mine).toHaveLength(0); // operations user has no schedules
      expect(result.all).toHaveLength(1); // but can see regular user's schedule
    });

    it('should handle user with no schedules', async () => {
      const result = await getSchedulesForUser(operationsUser);

      expect(result.mine).toHaveLength(0);
      expect(result.all).toHaveLength(1); // can see other users' schedules
    });
  });

  describe('getScheduleDetail', () => {
    it('should return schedule detail for owner', async () => {
      const result = await getScheduleDetail(testSchedule.id, regularUser);

      expect(result).toBeDefined();
      expect(result.id).toBe(testSchedule.id);
      expect(result.name).toBe(testSchedule.name);
    });

    it('should return schedule detail for operations user', async () => {
      const result = await getScheduleDetail(testSchedule.id, operationsUser);

      expect(result).toBeDefined();
      expect(result.id).toBe(testSchedule.id);
      expect(result.name).toBe(testSchedule.name);
    });

    it('should reject access for non-owner non-operations user', async () => {
      // Create another user
      const otherUserData = await createTestUser({
        username: 'other_user',
        email: 'other@example.com',
        password: 'password123',
        roles: ['personnel']
      });

      const otherUser = {
        id: otherUserData.id,
        username: otherUserData.username,
        email: otherUserData.email,
        roles: ['personnel' as const] // Hardcode for test
      };

      await expect(
        getScheduleDetail(testSchedule.id, otherUser)
      ).rejects.toThrow('Access denied');
    });

    it('should throw error for non-existent schedule', async () => {
      await expect(
        getScheduleDetail(99999, regularUser)
      ).rejects.toThrow('Schedule not found');
    });
  });

  describe('deleteSchedule', () => {
    it('should delete schedule for owner', async () => {
      // Create a new schedule to test deletion
      const scheduleToDelete = await createTestSchedule({
        name: 'Schedule to Delete',
        userId: regularUser.id,
        template: false,
        request: 0
      });

      await expect(
        deleteSchedule(scheduleToDelete.id, regularUser)
      ).resolves.toBeUndefined();
    });

    it('should delete schedule for operations user', async () => {
      // Create a new schedule to test deletion
      const scheduleToDelete = await createTestSchedule({
        name: 'Schedule to Delete by Operations',
        userId: regularUser.id,
        template: false,
        request: 0
      });

      await expect(
        deleteSchedule(scheduleToDelete.id, operationsUser)
      ).resolves.toBeUndefined();
    });

    it('should reject deletion for non-owner non-operations user', async () => {
      // Create another user
      const otherUserData = await createTestUser({
        username: 'delete_user',
        email: 'delete@example.com',
        password: 'password123',
        roles: ['personnel']
      });

      const otherUser = {
        id: otherUserData.id,
        username: otherUserData.username,
        email: otherUserData.email,
        roles: ['personnel' as const] // Hardcode for test
      };

      await expect(
        deleteSchedule(testSchedule.id, otherUser)
      ).rejects.toThrow('Access denied');
    });

    it('should throw error for non-existent schedule', async () => {
      await expect(
        deleteSchedule(99999, regularUser)
      ).rejects.toThrow('Schedule not found');
    });
  });
});
