import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as shiftService from '../../services/shiftService';
import { resetTestDatabase, createTestUser, createTestSchedule, createTestArea, createTestDay, createTestPerson } from '../utils/testDbOptimized';
import { timeStringToSeconds, secondsToTimeString } from '@shared/types';
import prisma from '../../services/prisma';

describe('shiftService', () => {
  let testUser: any;
  let testSchedule: any;
  let testArea: any;
  let testDay: any;

  beforeEach(async () => {
    await resetTestDatabase();
    // Create shared test data
    testUser = await createTestUser({ username: 'test', email: 'test@example.com' });
    testSchedule = await createTestSchedule({ name: 'Test Schedule', userId: testUser.id });
    testArea = await createTestArea(testSchedule.id, { name: 'Kitchen', shortName: 'K' });
    testDay = await createTestDay(testSchedule.id, { name: 'Monday', dayOfWeek: 2 });
  });

  afterEach(async () => {
    await resetTestDatabase();
  });

  describe('createShift', () => {
    it('should create shift with valid data', async () => {

      const shiftData = {
        areaId: testArea.id,
        dayId: testDay.id,
        startAtSeconds: timeStringToSeconds('09:00:00'),
        endAtSeconds: timeStringToSeconds('17:00:00'),
        numPeople: 2,
        scheduleId: testSchedule.id,
      };

      const result = await shiftService.createShift(shiftData);

      expect(result.id).toBeDefined();
      expect(result.areaId).toBe(testArea.id);
      expect(result.dayId).toBe(testDay.id);
      expect(result.startAtSeconds).toBe(timeStringToSeconds('09:00:00'));
      expect(result.endAtSeconds).toBe(timeStringToSeconds('17:00:00'));
      expect(result.numPeople).toBe(2);
      expect(result.scheduleId).toBe(testSchedule.id);
    });

    it('should include area and day details in response', async () => {
      const user = await createTestUser({ roles: ['operations'] });
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id });
      const area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' });
      const day = await createTestDay(schedule.id, { name: 'Monday', dayOfWeek: 2 });

      const shiftData = {
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: timeStringToSeconds('09:00:00'),
        endAtSeconds: timeStringToSeconds('17:00:00'),
        numPeople: 1,
        scheduleId: schedule.id,
      };

      const result = await shiftService.createShift(shiftData);

      expect(result.area).toEqual({
        id: area.id,
        name: 'Kitchen',
        shortName: 'K',
      });
      expect(result.day).toEqual({
        id: day.id,
        name: 'Monday',
        dayOfWeek: 2,
      });
    });

    it('should throw error when end time is before start time', async () => {
      const user = await createTestUser({ roles: ['operations'] });
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id });
      const area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' });
      const day = await createTestDay(schedule.id, { name: 'Monday', dayOfWeek: 2 });

      const shiftData = {
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: timeStringToSeconds('17:00:00'),
        endAtSeconds: timeStringToSeconds('09:00:00'), // End before start
        numPeople: 1,
        scheduleId: schedule.id,
      };

      await expect(shiftService.createShift(shiftData)).rejects.toThrow('End time must be after start time');
    });

    it('should throw error when area does not exist', async () => {
      const user = await createTestUser({ roles: ['operations'] });
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id });
      const day = await createTestDay(schedule.id, { name: 'Monday', dayOfWeek: 2 });

      const shiftData = {
        areaId: 999, // Non-existent area
        dayId: day.id,
        startAtSeconds: timeStringToSeconds('09:00:00'),
        endAtSeconds: timeStringToSeconds('17:00:00'),
        numPeople: 1,
        scheduleId: schedule.id,
      };

      await expect(shiftService.createShift(shiftData)).rejects.toThrow('Invalid area or day');
    });

    it('should throw error when area and day belong to different schedules', async () => {
      const user1 = await createTestUser({ roles: ['operations'] });
      const user2 = await createTestUser({ roles: ['operations'] });
      const schedule1 = await createTestSchedule({ name: 'Schedule 1', userId: user1.id });
      const schedule2 = await createTestSchedule({ name: 'Schedule 2', userId: user2.id });
      const area = await createTestArea(schedule1.id, { name: 'Kitchen', shortName: 'K' });
      const day = await createTestDay(schedule2.id, { name: 'Monday', dayOfWeek: 2 });

      const shiftData = {
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: timeStringToSeconds('09:00:00'),
        endAtSeconds: timeStringToSeconds('17:00:00'),
        numPeople: 1,
        scheduleId: schedule1.id,
      };

      await expect(shiftService.createShift(shiftData)).rejects.toThrow('Area and day must belong to the same schedule');
    });
  });

  describe('getAllShifts', () => {
    it('should return empty array when no shifts exist', async () => {
      const user = await createTestUser({ roles: ['operations'] });
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id });
      
      const result = await shiftService.getAllShifts(schedule.id);
      
      expect(result).toEqual([]);
    });

    it('should return shifts ordered by day and time', async () => {
      const user = await createTestUser({ roles: ['operations'] });
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id });
      const area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' });
      const day1 = await createTestDay(schedule.id, { name: 'Monday', dayOfWeek: 2 });
      const day2 = await createTestDay(schedule.id, { name: 'Sunday', dayOfWeek: 1 });

      // Create shifts in reverse order
      await shiftService.createShift({
        areaId: area.id,
        dayId: day1.id,
        startAtSeconds: timeStringToSeconds('17:00:00'),
        endAtSeconds: timeStringToSeconds('18:00:00'),
        numPeople: 1,
        scheduleId: schedule.id,
      });

      await shiftService.createShift({
        areaId: area.id,
        dayId: day1.id,
        startAtSeconds: timeStringToSeconds('09:00:00'),
        endAtSeconds: timeStringToSeconds('10:00:00'),
        numPeople: 1,
        scheduleId: schedule.id,
      });

      await shiftService.createShift({
        areaId: area.id,
        dayId: day2.id, // Sunday (dayOfWeek: 1) should come first
        startAtSeconds: timeStringToSeconds('12:00:00'),
        endAtSeconds: timeStringToSeconds('13:00:00'),
        numPeople: 1,
        scheduleId: schedule.id,
      });

      const result = await shiftService.getAllShifts(schedule.id);

      expect(result).toHaveLength(3);
      // Should be ordered by dayOfWeek first, then start time
      expect(result[0].day?.dayOfWeek).toBe(1); // Sunday
      expect(result[1].day?.dayOfWeek).toBe(2); // Monday
      expect(result[1].startAtSeconds).toBe(timeStringToSeconds('09:00:00')); // Earlier Monday shift
      expect(result[2].day?.dayOfWeek).toBe(2); // Monday
      expect(result[2].startAtSeconds).toBe(timeStringToSeconds('17:00:00')); // Later Monday shift
    });
  });

  describe('updateShift', () => {
    it('should update shift with valid data', async () => {
      const user = await createTestUser({ roles: ['operations'] });
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id });
      const area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' });
      const day = await createTestDay(schedule.id, { name: 'Monday', dayOfWeek: 2 });

      const shift = await shiftService.createShift({
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: timeStringToSeconds('09:00:00'),
        endAtSeconds: timeStringToSeconds('17:00:00'),
        numPeople: 1,
        scheduleId: schedule.id,
      });

      const result = await shiftService.updateShift(shift.id, {
        startAtSeconds: timeStringToSeconds('10:00:00'),
        endAtSeconds: timeStringToSeconds('18:00:00'),
        numPeople: 3,
      });

      expect(result).not.toBeNull();
      expect(result!.startAtSeconds).toBe(timeStringToSeconds('10:00:00'));
      expect(result!.endAtSeconds).toBe(timeStringToSeconds('18:00:00'));
      expect(result!.numPeople).toBe(3);
    });

    it('should prevent reducing numPeople below current assignments', async () => {
      const user = await createTestUser({ roles: ['operations'] });
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id });
      const area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' });
      const day = await createTestDay(schedule.id, { name: 'Monday', dayOfWeek: 2 });

      const shift = await shiftService.createShift({
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: timeStringToSeconds('09:00:00'),
        endAtSeconds: timeStringToSeconds('17:00:00'),
        numPeople: 3,
        scheduleId: schedule.id,
      });

      // Create people first
      const person1 = await createTestPerson({ first: 'John', last: 'Doe' });
      const person2 = await createTestPerson({ first: 'Jane', last: 'Smith' });

      // Simulate existing assignments by creating them directly
      await prisma.assignment.create({
        data: {
          scheduleId: schedule.id,
          shiftId: shift.id,
          personId: person1.id,
          star: false,
        },
      });

      await prisma.assignment.create({
        data: {
          scheduleId: schedule.id,
          shiftId: shift.id,
          personId: person2.id,
          star: false,
        },
      });

      await expect(shiftService.updateShift(shift.id, {
        numPeople: 1, // Less than 2 existing assignments
      })).rejects.toThrow('Too many people already assigned');
    });
  });

  describe('deleteShift', () => {
    it('should delete existing shift', async () => {
      const user = await createTestUser({ roles: ['operations'] });
      const schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id });
      const area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' });
      const day = await createTestDay(schedule.id, { name: 'Monday', dayOfWeek: 2 });

      const shift = await shiftService.createShift({
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: timeStringToSeconds('09:00:00'),
        endAtSeconds: timeStringToSeconds('17:00:00'),
        numPeople: 1,
        scheduleId: schedule.id,
      });

      const result = await shiftService.deleteShift(shift.id);
      expect(result).toBe(true);

      // Verify shift is deleted
      const deletedShift = await shiftService.getShiftById(shift.id);
      expect(deletedShift).toBeNull();
    });

    it('should return false when shift does not exist', async () => {
      const result = await shiftService.deleteShift(999);
      expect(result).toBe(false);
    });
  });
});