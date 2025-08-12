import { describe, it, expect, beforeEach } from '@jest/globals';
import { 
  createTestArea,
  createTestSchedule,
  createTestShift,
  createTestAssignment,
  createTestDay,
  createTestPerson,
  resetTestDatabase, 
  prisma 
} from '../utils/testDbOptimized';
import * as areaService from '../../services/areaService';

describe('areaService', () => {
  let testSchedule: any;

  beforeEach(async () => {
    await resetTestDatabase();
    testSchedule = await createTestSchedule({ name: 'Test Schedule' });
  });

  describe('createArea', () => {
    it('should create area with valid input', async () => {
      const input = {
        name: 'Kitchen',
        shortName: 'K',
        notes: 'Main kitchen area',
        scheduleId: testSchedule.id,
      };

      const result = await areaService.createArea(input);

      expect(result).toEqual({
        id: expect.any(Number),
        scheduleId: testSchedule.id,
        name: 'Kitchen',
        shortName: 'K',
        notes: 'Main kitchen area',
      });
    });

    it('should create area without notes', async () => {
      const input = {
        name: 'Dining Room',
        shortName: 'DR',
        scheduleId: testSchedule.id,
      };

      const result = await areaService.createArea(input);

      expect(result).toEqual({
        id: expect.any(Number),
        scheduleId: testSchedule.id,
        name: 'Dining Room',
        shortName: 'DR',
        notes: null,
      });
    });

    it('should throw validation error for invalid input', async () => {
      const input = {
        name: '', // Invalid: empty name
        shortName: 'K',
        scheduleId: testSchedule.id,
      };

      await expect(areaService.createArea(input)).rejects.toThrow();
    });

    it('should throw validation error for missing shortName', async () => {
      const input = {
        name: 'Kitchen',
        shortName: '', // Invalid: empty shortName
        scheduleId: testSchedule.id,
      };

      await expect(areaService.createArea(input)).rejects.toThrow();
    });
  });

  describe('getAllAreas', () => {
    it('should return areas for specific schedule', async () => {
      const schedule2 = await createTestSchedule({ name: 'Schedule 2' });
      
      await createTestArea(testSchedule.id, { name: 'Kitchen', shortName: 'K' });
      await createTestArea(testSchedule.id, { name: 'Dining', shortName: 'D' });
      await createTestArea(schedule2.id, { name: 'Other Kitchen', shortName: 'OK' });

      const result = await areaService.getAllAreas(testSchedule.id);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Dining'); // Should be sorted alphabetically
      expect(result[1].name).toBe('Kitchen');
      expect(result.every(area => area.scheduleId === testSchedule.id)).toBe(true);
    });

    it('should return empty array for schedule with no areas', async () => {
      const result = await areaService.getAllAreas(testSchedule.id);
      expect(result).toEqual([]);
    });
  });

  describe('getAreaById', () => {
    it('should return area by id', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K',
        notes: 'Test notes'
      });

      const result = await areaService.getAreaById(area.id);

      expect(result).toEqual({
        id: area.id,
        scheduleId: testSchedule.id,
        name: 'Kitchen',
        shortName: 'K',
        notes: 'Test notes',
      });
    });

    it('should return null for non-existent area', async () => {
      const result = await areaService.getAreaById(999999);
      expect(result).toBeNull();
    });
  });

  describe('updateArea', () => {
    it('should update area with valid input', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      const updateData = {
        name: 'Main Kitchen',
        shortName: 'MK',
        notes: 'Updated notes',
      };

      const result = await areaService.updateArea(area.id, updateData);

      expect(result).toEqual({
        id: area.id,
        scheduleId: testSchedule.id,
        name: 'Main Kitchen',
        shortName: 'MK',
        notes: 'Updated notes',
      });
    });

    it('should update only provided fields', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K',
        notes: 'Original notes'
      });

      const updateData = {
        name: 'Main Kitchen',
      };

      const result = await areaService.updateArea(area.id, updateData);

      expect(result).toEqual({
        id: area.id,
        scheduleId: testSchedule.id,
        name: 'Main Kitchen',
        shortName: 'K', // Unchanged
        notes: 'Original notes', // Unchanged
      });
    });

    it('should return null for non-existent area', async () => {
      const result = await areaService.updateArea(999999, { name: 'Test' });
      expect(result).toBeNull();
    });

    it('should throw validation error for invalid update', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      await expect(
        areaService.updateArea(area.id, { name: '' })
      ).rejects.toThrow();
    });
  });

  describe('deleteArea', () => {
    it('should delete area with no associated shifts', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      const result = await areaService.deleteArea(area.id);
      expect(result).toBe(true);

      const deletedArea = await areaService.getAreaById(area.id);
      expect(deletedArea).toBeNull();
    });

    it('should delete area and clear all associated shifts and assignments', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      // Create a day for the shift
      const day = await createTestDay(testSchedule.id, { name: 'Monday', dayOfWeek: 1 });

      // Create a shift in the area
      const shift = await createTestShift(testSchedule.id, {
        areaId: area.id,
        dayId: day.id,
        startTime: '09:00:00',
        endTime: '17:00:00',
        numPeople: 2
      });

      // Create an assignment for the shift
      const assignment = await createTestAssignment(testSchedule.id, {
        shiftId: shift.id
      });

      // Verify shift and assignment exist
      expect(await prisma.shift.findUnique({ where: { id: shift.id } })).not.toBeNull();
      expect(await prisma.assignment.findUnique({ where: { id: assignment.id } })).not.toBeNull();

      // Delete the area
      const result = await areaService.deleteArea(area.id);
      expect(result).toBe(true);

      // Verify area, shift, and assignment are all deleted
      expect(await areaService.getAreaById(area.id)).toBeNull();
      expect(await prisma.shift.findUnique({ where: { id: shift.id } })).toBeNull();
      expect(await prisma.assignment.findUnique({ where: { id: assignment.id } })).toBeNull();
    });

    it('should return false for non-existent area', async () => {
      const result = await areaService.deleteArea(999999);
      expect(result).toBe(false);
    });
  });

  describe('clearAreaShifts', () => {
    it('should clear all shifts and assignments from area', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      // Create days first
      const day1 = await createTestDay(testSchedule.id, { name: 'Monday', dayOfWeek: 1 });
      const day2 = await createTestDay(testSchedule.id, { name: 'Tuesday', dayOfWeek: 2 });

      // Create multiple shifts
      const shift1 = await createTestShift(testSchedule.id, {
        areaId: area.id,
        dayId: day1.id,
        startTime: '09:00:00',
        endTime: '17:00:00',
        numPeople: 2
      });

      const shift2 = await createTestShift(testSchedule.id, {
        areaId: area.id,
        dayId: day2.id,
        startTime: '10:00:00',
        endTime: '18:00:00',
        numPeople: 1
      });

      // Create assignments
      const assignment1 = await createTestAssignment(testSchedule.id, {
        shiftId: shift1.id
      });

      const assignment2 = await createTestAssignment(testSchedule.id, {
        shiftId: shift2.id
      });

      // Clear the area
      await areaService.clearAreaShifts(area.id);

      // Area should still exist
      expect(await areaService.getAreaById(area.id)).not.toBeNull();

      // But shifts and assignments should be deleted
      expect(await prisma.shift.findUnique({ where: { id: shift1.id } })).toBeNull();
      expect(await prisma.shift.findUnique({ where: { id: shift2.id } })).toBeNull();
      expect(await prisma.assignment.findUnique({ where: { id: assignment1.id } })).toBeNull();
      expect(await prisma.assignment.findUnique({ where: { id: assignment2.id } })).toBeNull();
    });

    it('should handle area with no shifts', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      // Should not throw error
      await expect(areaService.clearAreaShifts(area.id)).resolves.not.toThrow();

      // Area should still exist
      expect(await areaService.getAreaById(area.id)).not.toBeNull();
    });
  });

  describe('getAreaShiftCount', () => {
    it('should return correct counts for area with shifts', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      // Create days first
      const day1 = await createTestDay(testSchedule.id, { name: 'Monday', dayOfWeek: 1 });
      const day2 = await createTestDay(testSchedule.id, { name: 'Tuesday', dayOfWeek: 2 });

      // Create regular shifts
      await createTestShift(testSchedule.id, {
        areaId: area.id,
        dayId: day1.id,
        startTime: '09:00:00',
        endTime: '17:00:00',
        numPeople: 2
      });

      const shift2 = await createTestShift(testSchedule.id, {
        areaId: area.id,
        dayId: day2.id,
        startTime: '10:00:00',
        endTime: '18:00:00',
        numPeople: 1
      });

      // Create assignment for one shift
      await createTestAssignment(testSchedule.id, {
        shiftId: shift2.id
      });

      // Create person for floating shift
      const person = await createTestPerson({ first: 'Test', last: 'Person' });

      // Create floating shift
      await prisma.floatingShift.create({
        data: {
          areaId: area.id,
          scheduleId: testSchedule.id,
          personId: person.id,
          hours: 8.0
        }
      });

      const result = await areaService.getAreaShiftCount(area.id);

      expect(result).toEqual({
        shifts: 2,
        floatingShifts: 1,
        assignments: 1,
      });
    });

    it('should return zero counts for area with no shifts', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      const result = await areaService.getAreaShiftCount(area.id);

      expect(result).toEqual({
        shifts: 0,
        floatingShifts: 0,
        assignments: 0,
      });
    });
  });

  describe('getAffectedSchedules', () => {
    it('should return schedule ID for existing area', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      const result = await areaService.getAffectedSchedules(area.id);
      expect(result).toEqual([testSchedule.id]);
    });

    it('should return empty array for non-existent area', async () => {
      const result = await areaService.getAffectedSchedules(999999);
      expect(result).toEqual([]);
    });
  });
});