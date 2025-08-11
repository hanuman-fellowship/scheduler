import { Request, Response } from 'express';
import * as scheduleService from '../services/scheduleService';
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
    const schedules = await scheduleService.getSchedulesForUser(req.user!);
    res.json(schedules);
  } catch (error) {
    console.error('Error in list schedules:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};

export const get = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const scheduleId = parseInt(req.params.id);
    const schedule = await scheduleService.getScheduleDetail(scheduleId, req.user!);
    res.json(schedule);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Schedule not found') {
        res.status(404).json({ 
          error: { 
            message: 'Schedule not found', 
            code: 'SCHEDULE_NOT_FOUND' 
          } 
        });
      } else if (error.message === 'Access denied') {
        res.status(403).json({ 
          error: { 
            message: 'Access denied', 
            code: 'FORBIDDEN' 
          } 
        });
      } else {
        console.error('Error in get schedule:', error);
        res.status(500).json({ 
          error: { 
            message: 'Internal server error', 
            code: 'INTERNAL_ERROR' 
          } 
        });
      }
    } else {
      console.error('Unknown error in get schedule:', error);
      res.status(500).json({ 
        error: { 
          message: 'Internal server error', 
          code: 'INTERNAL_ERROR' 
        } 
      });
    }
  }
};

export const copy = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(501).json({ error: { message: 'Not implemented yet', code: 'NOT_IMPLEMENTED' } });
};

export const publish = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(501).json({ error: { message: 'Not implemented yet', code: 'NOT_IMPLEMENTED' } });
};

export const deleteSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const scheduleId = parseInt(req.params.id);
    await scheduleService.deleteSchedule(scheduleId, req.user!);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Schedule not found') {
        res.status(404).json({ 
          error: { 
            message: 'Schedule not found', 
            code: 'SCHEDULE_NOT_FOUND' 
          } 
        });
      } else if (error.message === 'Access denied') {
        res.status(403).json({ 
          error: { 
            message: 'Access denied', 
            code: 'FORBIDDEN' 
          } 
        });
      } else {
        console.error('Error in delete schedule:', error);
        res.status(500).json({ 
          error: { 
            message: 'Internal server error', 
            code: 'INTERNAL_ERROR' 
          } 
        });
      }
    } else {
      console.error('Unknown error in delete schedule:', error);
      res.status(500).json({ 
        error: { 
          message: 'Internal server error', 
          code: 'INTERNAL_ERROR' 
        } 
      });
    }
  }
};