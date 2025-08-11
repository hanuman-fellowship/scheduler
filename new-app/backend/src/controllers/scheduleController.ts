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
  const schedules = await scheduleService.getSchedulesForUser(req.user!);
  res.json(schedules);
};

export const get = async (req: AuthRequest, res: Response): Promise<void> => {
  const scheduleId = parseInt(req.params.id);
  const schedule = await scheduleService.getScheduleDetail(scheduleId, req.user!);
  res.json(schedule);
};

export const copy = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(501).json({ error: { message: 'Not implemented yet', code: 'NOT_IMPLEMENTED' } });
};

export const publish = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(501).json({ error: { message: 'Not implemented yet', code: 'NOT_IMPLEMENTED' } });
};

export const deleteSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  const scheduleId = parseInt(req.params.id);
  await scheduleService.deleteSchedule(scheduleId, req.user!);
  res.status(204).send();
};