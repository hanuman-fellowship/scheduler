import { describe, it, expect, beforeEach } from '@jest/globals';
import { 
  createTestArea,
  createTestSchedule,
  createTestShift,
  createTestAssignment,
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
      
      await createTestArea({ name: 'Kitchen', shortName: 'K', scheduleId: testSchedule.id });
      await createTestArea({ name: 'Dining', shortName: 'D', scheduleId: testSchedule.id });
      await createTestArea({ name: 'Other Kitchen', shortName: 'OK', scheduleId: schedule2.id });

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
      const area = await createTestArea({ 
        name: 'Kitchen', 
        shortName: 'K', 
        scheduleId: testSchedule.id,
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
      const area = await createTestArea({ 
        name: 'Kitchen', 
        shortName: 'K', 
        scheduleId: testSchedule.id 
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
      const area = await createTestArea({ 
        name: 'Kitchen', 
        shortName: 'K', 
        scheduleId: testSchedule.id,
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
      const area = await createTestArea({ 
        name: 'Kitchen', 
        shortName: 'K', 
        scheduleId: testSchedule.id 
      });

      await expect(
        areaService.updateArea(area.id, { name: '' })
      ).rejects.toThrow();
    });
  });

  describe('deleteArea', () => {
    it('should delete area with no associated shifts', async () => {
      const area = await createTestArea({ 
        name: 'Kitchen', 
        shortName: 'K', 
        scheduleId: testSchedule.id 
      });

      const result = await areaService.deleteArea(area.id);
      expect(result).toBe(true);

      const deletedArea = await areaService.getAreaById(area.id);
      expect(deletedArea).toBeNull();
    });

    it('should delete area and clear all associated shifts and assignments', async () => {
      const area = await createTestArea({ 
        name: 'Kitchen', 
        shortName: 'K', 
        scheduleId: testSchedule.id 
      });

      // Create a shift in the area
      const shift = await createTestShift({
        areaId: area.id,
        dayId: 1,
        start: '09:00',
        end: '17:00',
        numPeople: 2,
        scheduleId: testSchedule.id
      });

      // Create an assignment for the shift
      const assignment = await createTestAssignment({
        shiftId: shift.id,
        scheduleId: testSchedule.id
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
      const area = await createTestArea({ 
        name: 'Kitchen', 
        shortName: 'K', 
        scheduleId: testSchedule.id 
      });

      // Create multiple shifts
      const shift1 = await createTestShift({
        areaId: area.id,
        dayId: 1,
        start: '09:00',
        end: '17:00',
        numPeople: 2,
        scheduleId: testSchedule.id
      });

      const shift2 = await createTestShift({
        areaId: area.id,
        dayId: 2,
        start: '10:00',
        end: '18:00',
        numPeople: 1,
        scheduleId: testSchedule.id
      });

      // Create assignments
      const assignment1 = await createTestAssignment({
        shiftId: shift1.id,
        scheduleId: testSchedule.id
      });

      const assignment2 = await createTestAssignment({
        shiftId: shift2.id,
        scheduleId: testSchedule.id
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
      const area = await createTestArea({ 
        name: 'Kitchen', 
        shortName: 'K', 
        scheduleId: testSchedule.id 
      });

      // Should not throw error
      await expect(areaService.clearAreaShifts(area.id)).resolves.not.toThrow();

      // Area should still exist
      expect(await areaService.getAreaById(area.id)).not.toBeNull();
    });
  });

  describe('getAreaShiftCount', () => {
    it('should return correct counts for area with shifts', async () => {
      const area = await createTestArea({ 
        name: 'Kitchen', 
        shortName: 'K', 
        scheduleId: testSchedule.id 
      });

      // Create regular shifts
      await createTestShift({
        areaId: area.id,
        dayId: 1,
        start: '09:00',
        end: '17:00',
        numPeople: 2,
        scheduleId: testSchedule.id
      });

      const shift2 = await createTestShift({
        areaId: area.id,
        dayId: 2,
        start: '10:00',
        end: '18:00',
        numPeople: 1,
        scheduleId: testSchedule.id
      });

      // Create assignment for one shift
      await createTestAssignment({
        shiftId: shift2.id,
        scheduleId: testSchedule.id
      });

      // Create floating shift
      await prisma.floatingShift.create({
        data: {
          areaId: area.id,
          scheduleId: testSchedule.id,
          dayId: 1,
          start: '08:00',
          end: '16:00',
          numPeople: 1,
          personId: 1
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
      const area = await createTestArea({ 
        name: 'Kitchen', 
        shortName: 'K', 
        scheduleId: testSchedule.id 
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
      const area = await createTestArea({ 
        name: 'Kitchen', 
        shortName: 'K', 
        scheduleId: testSchedule.id 
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