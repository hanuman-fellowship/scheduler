import { Request, Response } from 'express';
import * as peopleService from '../services/peopleService';
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