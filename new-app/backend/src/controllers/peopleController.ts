import { Request, Response } from 'express';
import * as peopleService from '../services/peopleService';
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
    const people = await peopleService.getAllPeople();
    res.json(people);
  } catch (error) {
    console.error('Error in list people:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};

export const listByCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const peopleByCategory = await peopleService.getPeopleByCategory();
    res.json(peopleByCategory);
  } catch (error) {
    console.error('Error in list people by category:', error);
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
          message: 'Invalid person ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    const person = await peopleService.getPersonById(id);
    if (!person) {
      res.status(404).json({
        error: {
          message: 'Person not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.json(person);
  } catch (error) {
    console.error('Error in get person:', error);
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
    const person = await peopleService.createPerson(req.body);
    res.status(201).json(person);
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

    console.error('Error in create person:', error);
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
          message: 'Invalid person ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    const person = await peopleService.updatePerson(id, req.body);
    if (!person) {
      res.status(404).json({
        error: {
          message: 'Person not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.json(person);
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

    console.error('Error in update person:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};

export const deletePerson = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        error: {
          message: 'Invalid person ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    const deleted = await peopleService.deletePerson(id);
    if (!deleted) {
      res.status(404).json({
        error: {
          message: 'Person not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error in delete person:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};

// POST /api/people/retire - Retire multiple people from current schedule
export const retire = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get current schedule (Published schedule with id: 1)
    const currentSchedule = await scheduleService.getScheduleDetail(1, req.user!);
    const scheduleId = currentSchedule.id;

    const { peopleIds } = req.body;
    if (!Array.isArray(peopleIds) || peopleIds.length === 0) {
      res.status(400).json({
        error: {
          message: 'peopleIds array is required',
          code: 'INVALID_INPUT'
        }
      });
      return;
    }

    const retiredNames = await peopleService.retireMultiplePeople(peopleIds, scheduleId);
    
    res.json({
      message: `People retired: ${retiredNames.join(', ')}`,
      retiredCount: retiredNames.length,
      retiredNames
    });
  } catch (error) {
    console.error('Error in retire people:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};

// GET /api/people/restorable - Get list of people who can be restored
export const getRestorable = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get current schedule (Published schedule with id: 1)
    const currentSchedule = await scheduleService.getScheduleDetail(1, req.user!);
    const scheduleId = currentSchedule.id;

    const people = await peopleService.getRestorablePeople(scheduleId);
    res.json(people);
  } catch (error) {
    console.error('Error in get restorable people:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};

// POST /api/people/:id/restore - Restore person to current schedule with category
export const restore = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const personId = parseInt(req.params.id);
    if (isNaN(personId)) {
      res.status(400).json({
        error: {
          message: 'Invalid person ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    // Get current schedule (Published schedule with id: 1)
    const currentSchedule = await scheduleService.getScheduleDetail(1, req.user!);
    const scheduleId = currentSchedule.id;

    const { categoryId } = req.body;
    if (!categoryId || isNaN(parseInt(categoryId))) {
      res.status(400).json({
        error: {
          message: 'Valid categoryId is required',
          code: 'INVALID_INPUT'
        }
      });
      return;
    }

    const restoredName = await peopleService.restorePerson(personId, scheduleId, parseInt(categoryId));
    
    res.json({
      message: `Person restored: ${restoredName}`,
      personName: restoredName
    });
  } catch (error: any) {
    if (error.message.includes('not found') || error.message.includes('already in this schedule')) {
      res.status(400).json({
        error: {
          message: error.message,
          code: 'INVALID_OPERATION'
        }
      });
      return;
    }

    console.error('Error in restore person:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};