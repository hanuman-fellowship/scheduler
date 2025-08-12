import { Request, Response } from 'express';
import * as shiftService from '../services/shiftService';
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

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
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

export const update = async (req: Request, res: Response): Promise<void> => {
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

export const deleteShift = async (req: Request, res: Response): Promise<void> => {
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