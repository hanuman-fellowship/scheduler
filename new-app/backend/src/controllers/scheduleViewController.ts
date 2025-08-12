import { Request, Response } from 'express';
import * as scheduleViewService from '../services/scheduleViewService';
import type { UserRole } from '@shared/types';

interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    roles: UserRole[];
  };
}

export const getAreaSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const areaId = parseInt(req.params.areaId);
    
    if (isNaN(areaId)) {
      res.status(400).json({
        error: {
          message: 'Invalid area ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'UNAUTHORIZED'
        }
      });
      return;
    }

    const schedule = await scheduleViewService.getAreaSchedule(areaId, req.user);
    res.json(schedule);
  } catch (error: any) {
    console.error('Error in getAreaSchedule:', error);
    
    if (error.message === 'Area not found') {
      res.status(404).json({
        error: {
          message: 'Area not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    if (error.message === 'Access denied') {
      res.status(403).json({
        error: {
          message: 'Access denied',
          code: 'FORBIDDEN'
        }
      });
      return;
    }

    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};

export const getPersonSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const personId = parseInt(req.params.personId);
    
    if (isNaN(personId)) {
      res.status(400).json({
        error: {
          message: 'Invalid person ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'UNAUTHORIZED'
        }
      });
      return;
    }

    const schedule = await scheduleViewService.getPersonSchedule(personId, req.user);
    res.json(schedule);
  } catch (error: any) {
    console.error('Error in getPersonSchedule:', error);
    
    if (error.message === 'Person not found in current schedule') {
      res.status(404).json({
        error: {
          message: 'Person not found in current schedule',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    if (error.message === 'Access denied') {
      res.status(403).json({
        error: {
          message: 'Access denied',
          code: 'FORBIDDEN'
        }
      });
      return;
    }

    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};

export const getGapsSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'UNAUTHORIZED'
        }
      });
      return;
    }

    const schedule = await scheduleViewService.getGapsSchedule(req.user);
    res.json(schedule);
  } catch (error: any) {
    console.error('Error in getGapsSchedule:', error);
    
    if (error.message === 'Access denied') {
      res.status(403).json({
        error: {
          message: 'Access denied',
          code: 'FORBIDDEN'
        }
      });
      return;
    }

    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};