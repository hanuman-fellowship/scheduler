import { getSchedulesForUser, getScheduleDetail, deleteSchedule } from '../../services/scheduleService';
import { createTestUser, createTestSchedule, createTestArea, createTestDay, createTestPerson, createTestResidentCategory, resetTestDatabase } from '../utils/testDb';
import { ensureTestDatabase } from '../utils/testConfig';
import type { AuthUser } from '@shared/types';

describe('ScheduleService', () => {
  let operationsUser: AuthUser;
  let regularUser: AuthUser;
  let testSchedule: any;
  let testArea: any;
  let testDay: any;
  let testPerson: any;
  let testCategory: any;

  beforeAll(async () => {
    await ensureTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();
    
    // Create users
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

    // Convert to AuthUser format
    operationsUser = {
      id: operationsUserData.id,
      username: operationsUserData.username,
      email: operationsUserData.email,
      roles: operationsUserData.roles
    };

    regularUser = {
      id: regularUserData.id,
      username: regularUserData.username,
      email: regularUserData.email,
      roles: regularUserData.roles
    };

    // Create test schedule for regular user
    testSchedule = await createTestSchedule({
      name: 'Test Schedule',
      userId: regularUser.id,
      template: false,
      request: 0
    });

    // Create test area
    testArea = await createTestArea(testSchedule.id, {
      name: 'Test Area',
      shortName: 'TA'
    });

    // Create test day
    testDay = await createTestDay(testSchedule.id, {
      name: 'Monday',
      dayOfWeek: 2
    });

    // Create test person
    testPerson = await createTestPerson({
      first: 'John',
      last: 'Doe',
      displayName: 'John Doe'
    });

    // Create test category
    testCategory = await createTestResidentCategory(testSchedule.id, {
      name: 'Resident',
      color: '#007bff'
    });
  });

  afterAll(async () => {
    await resetTestDatabase();
  });

  describe('getSchedulesForUser', () => {
    it('should return user schedules for regular user', async () => {
      const result = await getSchedulesForUser(regularUser);

      expect(result).toHaveProperty('mine');
      expect(result).not.toHaveProperty('all');
      expect(result.mine).toHaveLength(1);
      expect(result.mine[0].name).toBe('Test Schedule');
      expect(result.mine[0].template).toBe(false);
      expect(result.mine[0].request).toBe(0);
      expect(result.mine[0]).toHaveProperty('createdAt');
    });

    it('should return all schedules for operations user', async () => {
      const result = await getSchedulesForUser(operationsUser);

      expect(result).toHaveProperty('mine');
      expect(result).toHaveProperty('all');
      expect(result.mine).toHaveLength(0); // operations user has no schedules
      expect(result.all).toHaveLength(1); // but can see regular user's schedule
      expect(result.all[0].name).toBe('Test Schedule');
      expect(result.all[0]).toHaveProperty('owner');
    });

    it('should handle user with no schedules', async () => {
      // Create another user with no schedules
      const newUserData = await createTestUser({
        username: 'new_user',
        email: 'new@example.com',
        password: 'password123',
        roles: ['personnel']
      });

      const newUser: AuthUser = {
        id: newUserData.id,
        username: newUserData.username,
        email: newUserData.email,
        roles: newUserData.roles
      };

      const result = await getSchedulesForUser(newUser);

      expect(result.mine).toHaveLength(0);
      expect(result).not.toHaveProperty('all');
    });

    it('should handle operations user with schedules', async () => {
      // Create a schedule for operations user
      const operationsSchedule = await createTestSchedule({
        name: 'Operations Schedule',
        userId: operationsUser.id,
        template: true,
        request: 1
      });

      const result = await getSchedulesForUser(operationsUser);

      expect(result.mine).toHaveLength(1);
      expect(result.all).toHaveLength(2); // both schedules
      expect(result.mine[0].name).toBe('Operations Schedule');
      expect(result.mine[0].template).toBe(true);
      expect(result.mine[0].request).toBe(1);
    });
  });

  describe('getScheduleDetail', () => {
    it('should return schedule detail for owner', async () => {
      const result = await getScheduleDetail(testSchedule.id, regularUser);

      expect(result.id).toBe(testSchedule.id);
      expect(result.name).toBe('Test Schedule');
      expect(result.template).toBe(false);
      expect(result.request).toBe(0);
      expect(result).toHaveProperty('areas');
      expect(result).toHaveProperty('days');
      expect(result).toHaveProperty('people');

      // Check areas
      expect(result.areas).toHaveLength(1);
      expect(result.areas[0].name).toBe('Test Area');
      expect(result.areas[0].shortName).toBe('TA');

      // Check days
      expect(result.days).toHaveLength(1);
      expect(result.days[0].name).toBe('Monday');
      expect(result.days[0].dayOfWeek).toBe(2);

      // Check people (empty for now since no peopleSchedules created)
      expect(result.people).toHaveLength(0);
    });

    it('should return schedule detail for operations user', async () => {
      const result = await getScheduleDetail(testSchedule.id, operationsUser);

      expect(result.id).toBe(testSchedule.id);
      expect(result.name).toBe('Test Schedule');
      expect(result).toHaveProperty('areas');
      expect(result).toHaveProperty('days');
      expect(result).toHaveProperty('people');
    });

    it('should throw error for non-existent schedule', async () => {
      await expect(getScheduleDetail(99999, regularUser))
        .rejects
        .toThrow('Schedule not found');
    });

    it('should throw error for non-owner non-operations user', async () => {
      // Create another user
      const anotherUserData = await createTestUser({
        username: 'another_user',
        email: 'another@example.com',
        password: 'password123',
        roles: ['personnel']
      });

      const anotherUser: AuthUser = {
        id: anotherUserData.id,
        username: anotherUserData.username,
        email: anotherUserData.email,
        roles: anotherUserData.roles
      };

      await expect(getScheduleDetail(testSchedule.id, anotherUser))
        .rejects
        .toThrow('Access denied');
    });

    it('should handle schedule with people', async () => {
      // Create people schedule
      const { prisma } = await import('../utils/testConfig');
      await prisma.peopleSchedule.create({
        data: {
          scheduleId: testSchedule.id,
          personId: testPerson.id,
          residentCategoryId: testCategory.id
        }
      });

      const result = await getScheduleDetail(testSchedule.id, regularUser);

      expect(result.people).toHaveLength(1);
      expect(result.people[0].id).toBe(testPerson.id);
      expect(result.people[0].first).toBe('John');
      expect(result.people[0].last).toBe('Doe');
      expect(result.people[0].name).toBe('John Doe');
      expect(result.people[0].category.id).toBe(testCategory.id);
      expect(result.people[0].category.name).toBe('Resident');
      expect(result.people[0].category.color).toBe('#007bff');
    });
  });

  describe('deleteSchedule', () => {
    it('should delete schedule for owner', async () => {
      await deleteSchedule(testSchedule.id, regularUser);

      // Verify schedule is deleted
      await expect(getScheduleDetail(testSchedule.id, regularUser))
        .rejects
        .toThrow('Schedule not found');
    });

    it('should delete schedule for operations user', async () => {
      await deleteSchedule(testSchedule.id, operationsUser);

      // Verify schedule is deleted
      await expect(getScheduleDetail(testSchedule.id, operationsUser))
        .rejects
        .toThrow('Schedule not found');
    });

    it('should throw error for non-existent schedule', async () => {
      await expect(deleteSchedule(99999, regularUser))
        .rejects
        .toThrow('Schedule not found');
    });

    it('should throw error for non-owner non-operations user', async () => {
      // Create another user
      const anotherUserData = await createTestUser({
        username: 'another_user',
        email: 'another@example.com',
        password: 'password123',
        roles: ['personnel']
      });

      const anotherUser: AuthUser = {
        id: anotherUserData.id,
        username: anotherUserData.username,
        email: anotherUserData.email,
        roles: anotherUserData.roles
      };

      await expect(deleteSchedule(testSchedule.id, anotherUser))
        .rejects
        .toThrow('Access denied');
    });

    it('should cascade delete related data', async () => {
      // Verify related data exists
      const { prisma } = await import('../utils/testConfig');
      
      const areas = await prisma.area.findMany({ where: { scheduleId: testSchedule.id } });
      const days = await prisma.day.findMany({ where: { scheduleId: testSchedule.id } });
      
      expect(areas).toHaveLength(1);
      expect(days).toHaveLength(1);

      // Delete schedule
      await deleteSchedule(testSchedule.id, regularUser);

      // Verify related data is deleted
      const areasAfter = await prisma.area.findMany({ where: { scheduleId: testSchedule.id } });
      const daysAfter = await prisma.day.findMany({ where: { scheduleId: testSchedule.id } });
      
      expect(areasAfter).toHaveLength(0);
      expect(daysAfter).toHaveLength(0);
    });
  });
});
