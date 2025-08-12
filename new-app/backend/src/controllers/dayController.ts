import { Request, Response } from 'express';
import * as dayService from '../services/dayService';
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

    if (isNaN(scheduleId)) {
      res.status(400).json({
        error: {
          message: 'Valid schedule ID is required',
          code: 'INVALID_SCHEDULE_ID'
        }
      });
      return;
    }

    const days = await dayService.getAllDays(scheduleId);
    res.json(days);
  } catch (error) {
    console.error('Error in list days:', error);
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
          message: 'Invalid day ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    const day = await dayService.getDayById(id);
    if (!day) {
      res.status(404).json({
        error: {
          message: 'Day not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.json(day);
  } catch (error) {
    console.error('Error in get day:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};