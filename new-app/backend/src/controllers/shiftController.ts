import { Request, Response } from 'express';
import * as shiftService from '../services/shiftService';
import { requireScheduleEditPermission } from '../services/schedulePermissionService';
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
  try {
    const scheduleId = parseInt(req.query.scheduleId as string);
    const areaId = req.query.areaId ? parseInt(req.query.areaId as string) : undefined;

    if (isNaN(scheduleId)) {
      res.status(400).json({
        error: {
          message: 'Valid schedule ID is required',
          code: 'INVALID_SCHEDULE_ID'
        }
      });
      return;
    }

    let shifts;
    if (areaId && !isNaN(areaId)) {
      shifts = await shiftService.getShiftsByArea(areaId, scheduleId);
    } else {
      shifts = await shiftService.getAllShifts(scheduleId);
    }

    res.json(shifts);
  } catch (error) {
    console.error('Error in list shifts:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};

export const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        error: {
          message: 'Invalid shift ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    const shift = await shiftService.getShiftById(id);
    if (!shift) {
      res.status(404).json({
        error: {
          message: 'Shift not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.json(shift);
  } catch (error) {
    console.error('Error in get shift:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if user can edit this schedule (legacy redirectIfNotEditable logic)
    await requireScheduleEditPermission(req.body.scheduleId, req.user!);
    
    const shift = await shiftService.createShift(req.body);
    res.status(201).json(shift);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({
        error: {
          message: error.errors[0]?.message || 'Validation error',
          field: error.errors[0]?.path[0],
          code: 'VALIDATION_ERROR'
        }
      });
      return;
    }

    // Permission errors get 403
    if (error.message.includes('Managers can only create shifts on draft requests') ||
        error.message.includes('Access denied')) {
      res.status(403).json({
        error: {
          message: error.message,
          code: 'ACCESS_DENIED'
        }
      });
      return;
    }
    
    // Business rule errors get 400
    if (error.message.includes('End time must be after start time') ||
        error.message.includes('Too many people already assigned') ||
        error.message.includes('Invalid area or day') ||
        error.message.includes('Area and day must belong to the same schedule')) {
      res.status(400).json({
        error: {
          message: error.message,
          code: 'BUSINESS_RULE_ERROR'
        }
      });
      return;
    }

    console.error('Error in create shift:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        error: {
          message: 'Invalid shift ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    // Get the shift first to check its schedule
    const existingShift = await shiftService.getShiftById(id);
    if (!existingShift) {
      res.status(404).json({
        error: {
          message: 'Shift not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }
    
    // Check if user can edit this schedule
    await requireScheduleEditPermission(existingShift.scheduleId, req.user!);

    const shift = await shiftService.updateShift(id, req.body);
    if (!shift) {
      res.status(404).json({
        error: {
          message: 'Shift not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.json(shift);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({
        error: {
          message: error.errors[0]?.message || 'Validation error',
          field: error.errors[0]?.path[0],
          code: 'VALIDATION_ERROR'
        }
      });
      return;
    }

    // Permission errors get 403
    if (error.message.includes('Managers can only create shifts on draft requests') ||
        error.message.includes('Access denied')) {
      res.status(403).json({
        error: {
          message: error.message,
          code: 'ACCESS_DENIED'
        }
      });
      return;
    }
    
    // Business rule errors get 400
    if (error.message.includes('End time must be after start time') ||
        error.message.includes('Too many people already assigned')) {
      res.status(400).json({
        error: {
          message: error.message,
          code: 'BUSINESS_RULE_ERROR'
        }
      });
      return;
    }

    console.error('Error in update shift:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};

export const deleteShift = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        error: {
          message: 'Invalid shift ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    // Get the shift first to check its schedule
    const existingShift = await shiftService.getShiftById(id);
    if (!existingShift) {
      res.status(404).json({
        error: {
          message: 'Shift not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }
    
    // Check if user can edit this schedule (operations only for delete)
    if (!req.user!.roles.includes('operations')) {
      res.status(403).json({
        error: {
          message: 'Only operations users can delete shifts',
          code: 'ACCESS_DENIED'
        }
      });
      return;
    }
    
    await requireScheduleEditPermission(existingShift.scheduleId, req.user!);

    const deleted = await shiftService.deleteShift(id);
    if (!deleted) {
      res.status(404).json({
        error: {
          message: 'Shift not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error in delete shift:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};