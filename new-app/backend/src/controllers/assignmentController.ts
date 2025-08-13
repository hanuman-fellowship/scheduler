import { Request, Response } from 'express'
import * as assignmentService from '../services/assignmentService'
import * as scheduleService from '../services/scheduleService'
import { createAssignmentRequestSchema, assignmentIdSchema } from '@shared/schemas'
import { z } from 'zod'
import type { UserRole } from '@shared/types'

interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    roles: UserRole[];
  };
}

const updateAssignmentSchema = z.object({
  personId: z.number().int().optional(),
  name: z.string().optional(),
  star: z.boolean().optional(),
});

// POST /api/assignments
export const createAssignment = async (req: AuthRequest, res: Response) => {
  try {
    // Get current schedule (Published schedule with id: 1)
    const currentSchedule = await scheduleService.getScheduleDetail(1, req.user!);
    const scheduleId = currentSchedule.id;

    const validatedData = createAssignmentRequestSchema.parse(req.body);
    
    const assignmentData = {
      ...validatedData,
      scheduleId,
    };

    const assignment = await assignmentService.createAssignment(assignmentData);
    res.status(201).json(assignment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: {
          message: 'Invalid assignment data',
          code: 'INVALID_INPUT',
          details: error.errors
        }
      });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        error: {
          message: error.message,
          code: 'ASSIGNMENT_ERROR'
        }
      });
      return;
    }

    res.status(500).json({
      error: {
        message: 'Failed to create assignment',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// PUT /api/assignments/:id
export const updateAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = assignmentIdSchema.parse(req.params);
    const validatedData = updateAssignmentSchema.parse(req.body);

    const assignment = await assignmentService.updateAssignment(id, validatedData);
    
    if (!assignment) {
      res.status(404).json({
        error: {
          message: 'Assignment not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.json(assignment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: {
          message: 'Invalid assignment data',
          code: 'INVALID_INPUT',
          details: error.errors
        }
      });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        error: {
          message: error.message,
          code: 'ASSIGNMENT_ERROR'
        }
      });
      return;
    }

    res.status(500).json({
      error: {
        message: 'Failed to update assignment',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// DELETE /api/assignments/:id
export const deleteAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = assignmentIdSchema.parse(req.params);
    
    const success = await assignmentService.deleteAssignment(id);
    
    if (!success) {
      res.status(404).json({
        error: {
          message: 'Assignment not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: {
          message: 'Invalid assignment ID',
          code: 'INVALID_INPUT',
          details: error.errors
        }
      });
      return;
    }

    res.status(500).json({
      error: {
        message: 'Failed to delete assignment',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// POST /api/assignments/:id/star
export const toggleAssignmentStar = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = assignmentIdSchema.parse(req.params);
    
    const assignment = await assignmentService.toggleAssignmentStar(id);
    
    if (!assignment) {
      res.status(404).json({
        error: {
          message: 'Assignment not found',
          code: 'NOT_FOUND'
        }
      });
      return;
    }

    res.json(assignment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: {
          message: 'Invalid assignment ID',
          code: 'INVALID_INPUT',
          details: error.errors
        }
      });
      return;
    }

    res.status(500).json({
      error: {
        message: 'Failed to toggle assignment star',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// GET /api/assignments/shift/:shiftId/available-people
export const getAvailablePeopleForShift = async (req: AuthRequest, res: Response) => {
  try {
    const shiftIdSchema = z.object({ shiftId: z.coerce.number().int().positive() });
    const { shiftId } = shiftIdSchema.parse(req.params);
    
    const people = await assignmentService.getAvailablePeopleForShift(shiftId);
    res.json(people);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: {
          message: 'Invalid shift ID',
          code: 'INVALID_INPUT',
          details: error.errors
        }
      });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        error: {
          message: error.message,
          code: 'ASSIGNMENT_ERROR'
        }
      });
      return;
    }

    res.status(500).json({
      error: {
        message: 'Failed to get available people',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

// GET /api/assignments/shift/:shiftId
export const getShiftAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const shiftIdSchema = z.object({ shiftId: z.coerce.number().int().positive() });
    const { shiftId } = shiftIdSchema.parse(req.params);
    
    const assignments = await assignmentService.getShiftAssignments(shiftId);
    res.json(assignments);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: {
          message: 'Invalid shift ID',
          code: 'INVALID_INPUT',
          details: error.errors
        }
      });
      return;
    }

    res.status(500).json({
      error: {
        message: 'Failed to get shift assignments',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};