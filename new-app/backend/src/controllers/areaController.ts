import { Request, Response } from 'express';
import * as areaService from '../services/areaService';
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

    const areas = await areaService.getAllAreas(scheduleId);
    res.json(areas);
  } catch (error) {
    console.error('Error in list areas:', error);
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
          message: 'Invalid area ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    const area = await areaService.getAreaById(id);
    if (!area) {
      res.status(404).json({
        error: {
          message: 'Area not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.json(area);
  } catch (error) {
    console.error('Error in get area:', error);
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
    const area = await areaService.createArea(req.body);
    res.status(201).json(area);
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

    console.error('Error in create area:', error);
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
          message: 'Invalid area ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    const area = await areaService.updateArea(id, req.body);
    if (!area) {
      res.status(404).json({
        error: {
          message: 'Area not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.json(area);
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

    console.error('Error in update area:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};

export const deleteArea = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        error: {
          message: 'Invalid area ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    const deleted = await areaService.deleteArea(id);
    if (!deleted) {
      res.status(404).json({
        error: {
          message: 'Area not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error in delete area:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};

export const clearArea = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        error: {
          message: 'Invalid area ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    await areaService.clearAreaShifts(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error in clear area:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};