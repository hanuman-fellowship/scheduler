import { Request, Response } from 'express';
import * as categoriesService from '../services/categoriesService';
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
    // Get current schedule (Published schedule with id: 1)
    const currentSchedule = await scheduleService.getScheduleDetail(1, req.user!);
    const categories = await categoriesService.getAllCategories(currentSchedule.id);
    res.json(categories);
  } catch (error) {
    console.error('Error in list categories:', error);
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
          message: 'Invalid category ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    const category = await categoriesService.getCategoryById(id);
    if (!category) {
      res.status(404).json({
        error: {
          message: 'Category not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.json(category);
  } catch (error) {
    console.error('Error in get category:', error);
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
    // Get current schedule (Published schedule with id: 1) and add to request body
    const currentSchedule = await scheduleService.getScheduleDetail(1, req.user!);
    const categoryData = {
      ...req.body,
      scheduleId: currentSchedule.id
    };
    
    const category = await categoriesService.createCategory(categoryData);
    res.status(201).json(category);
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

    if (error.message === 'Category name already exists') {
      res.status(400).json({
        error: {
          message: 'Category name already exists',
          field: 'name',
          code: 'DUPLICATE_NAME'
        }
      });
      return;
    }

    console.error('Error in create category:', error);
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
          message: 'Invalid category ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    const category = await categoriesService.updateCategory(id, req.body);
    if (!category) {
      res.status(404).json({
        error: {
          message: 'Category not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.json(category);
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

    if (error.message === 'Category name already exists') {
      res.status(400).json({
        error: {
          message: 'Category name already exists',
          field: 'name',
          code: 'DUPLICATE_NAME'
        }
      });
      return;
    }

    console.error('Error in update category:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        error: {
          message: 'Invalid category ID',
          code: 'INVALID_ID'
        }
      });
      return;
    }

    const result = await categoriesService.deleteCategory(id);
    if (!result.success) {
      if (result.error === 'Category not found') {
        res.status(404).json({
          error: {
            message: 'Category not found',
            code: 'NOT_FOUND'
          }
        });
        return;
      }

      if (result.error === 'Cannot delete category that has people assigned') {
        res.status(400).json({
          error: {
            message: 'Cannot delete category that has people assigned',
            code: 'CATEGORY_IN_USE'
          }
        });
        return;
      }
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error in delete category:', error);
    res.status(500).json({ 
      error: { 
        message: 'Internal server error', 
        code: 'INTERNAL_ERROR' 
      } 
    });
  }
};