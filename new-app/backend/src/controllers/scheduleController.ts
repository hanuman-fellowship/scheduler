import { Request, Response } from 'express';
import * as scheduleService from '../services/scheduleService';
import prisma from '../services/prisma';
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

export const getCurrentSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let currentScheduleId: number | null = null;
    
    // First, check if user has a stored schedule preference
    const userSetting = await prisma.setting.findFirst({
      where: {
        userId: req.user!.id,
        key: 'current_schedule_id'
      }
    });
    
    if (userSetting) {
      const preferredScheduleId = parseInt(userSetting.val);
      if (!isNaN(preferredScheduleId)) {
        // Verify the preferred schedule still exists and user has access
        try {
          await scheduleService.getScheduleDetail(preferredScheduleId, req.user!);
          currentScheduleId = preferredScheduleId;
        } catch (error) {
          // Preferred schedule no longer accessible, fall back to default
          console.log(`User's preferred schedule ${preferredScheduleId} no longer accessible, falling back to default`);
        }
      }
    }
    
    // If no valid preference found, use fallback logic
    if (!currentScheduleId) {
      // Try to get latest published schedule
      const publishedSchedule = await prisma.schedule.findFirst({
        where: { name: 'Published' },
        orderBy: { updatedAt: 'desc' }
      });
      
      if (publishedSchedule) {
        currentScheduleId = publishedSchedule.id;
      } else {
        // If no published schedule, try to get user's most recent schedule
        const userSchedule = await prisma.schedule.findFirst({
          where: { userId: req.user!.id },
          orderBy: { updatedAt: 'desc' }
        });
        
        if (!userSchedule) {
          res.status(404).json({ 
            error: { 
              message: 'Current schedule not found', 
              code: 'CURRENT_SCHEDULE_NOT_FOUND' 
            } 
          });
          return;
        }
        currentScheduleId = userSchedule.id;
      }
    }
    
    // Get the full schedule details using the service
    const currentSchedule = await scheduleService.getScheduleDetail(currentScheduleId, req.user!);
    res.json(currentSchedule);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Schedule not found') {
        res.status(404).json({ 
          error: { 
            message: 'Current schedule not found', 
            code: 'CURRENT_SCHEDULE_NOT_FOUND' 
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
        console.error('Error in get current schedule:', error);
        res.status(500).json({ 
          error: { 
            message: 'Internal server error', 
            code: 'INTERNAL_ERROR' 
          } 
        });
      }
    } else {
      console.error('Unknown error in get current schedule:', error);
      res.status(500).json({ 
        error: { 
          message: 'Internal server error', 
          code: 'INTERNAL_ERROR' 
        } 
      });
    }
  }
};

export const setCurrentSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const scheduleId = parseInt(req.params.id);
    
    if (isNaN(scheduleId)) {
      res.status(400).json({ 
        error: { 
          message: 'Invalid schedule ID', 
          code: 'INVALID_SCHEDULE_ID' 
        } 
      });
      return;
    }
    
    // Verify the schedule exists and user has access
    const schedule = await scheduleService.getScheduleDetail(scheduleId, req.user!);
    
    // Store user's schedule preference (manual upsert since no unique constraint)
    const existingSetting = await prisma.setting.findFirst({
      where: {
        userId: req.user!.id,
        key: 'current_schedule_id'
      }
    });
    
    if (existingSetting) {
      await prisma.setting.update({
        where: { id: existingSetting.id },
        data: { val: scheduleId.toString() }
      });
    } else {
      await prisma.setting.create({
        data: {
          userId: req.user!.id,
          key: 'current_schedule_id',
          val: scheduleId.toString()
        }
      });
    }
    
    // Return the full schedule details
    res.json({
      message: 'Schedule set as current',
      schedule
    });
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
        console.error('Error in set current schedule:', error);
        res.status(500).json({ 
          error: { 
            message: 'Internal server error', 
            code: 'INTERNAL_ERROR' 
          } 
        });
      }
    } else {
      console.error('Unknown error in set current schedule:', error);
      res.status(500).json({ 
        error: { 
          message: 'Internal server error', 
          code: 'INTERNAL_ERROR' 
        } 
      });
    }
  }
};