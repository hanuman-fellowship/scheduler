import { Request, Response } from 'express';
import * as requestService from '../services/requestService';
import { AuthRequest } from '../middleware/auth';
import prisma from '../services/prisma';

// Create a new draft request (Manager only)
export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await requestService.createRequest(req.user!.id, req.body);
    res.status(201).json({
      message: 'Request created successfully',
      request: result
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create request' });
    }
  }
};

// Get all draft requests for the current manager
export const getDrafts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const drafts = await requestService.getManagerDraftRequests(req.user!.id);
    res.json({ drafts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch draft requests' });
  }
};

// Submit a draft request (Manager only)
export const submit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requestId = parseInt(req.params.id);
    const requestName = await requestService.submitRequest(req.user!.id, requestId);
    res.json({
      message: `Request "${requestName}" submitted successfully`,
      requestId
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to submit request' });
    }
  }
};

// Get all submitted requests grouped by area (Operations only)
export const getSubmitted = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requestsByArea = await requestService.getSubmittedRequests();
    res.json({ requestsByArea });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submitted requests' });
  }
};

// Accept a submitted request (Operations only)
export const accept = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requestId = parseInt(req.params.id);
    const clearAreaFirst = req.body.clearAreaFirst !== false; // Default to true
    
    const requestName = await requestService.acceptRequest(requestId, clearAreaFirst);
    res.json({
      message: `Request "${requestName}" accepted and merged successfully`,
      requestId
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to accept request' });
    }
  }
};

// Delete a request - Managers can delete their own, Operations can delete any
export const deleteRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requestId = parseInt(req.params.id);
    const isOperations = req.user!.roles.includes('operations');
    
    // Operations can delete any request, managers only their own
    const userId = isOperations ? undefined : req.user!.id;
    
    const requestName = await requestService.deleteRequest(requestId, userId);
    res.json({
      message: `Request "${requestName}" deleted successfully`,
      requestId
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete request' });
    }
  }
};

// Get available base schedules for request creation (templates, published schedule, previous requests)
export const getBaseOptions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const areaId = parseInt(req.params.areaId);
    
    // Get available base schedules
    const [publishedSchedule, templates, previousRequests] = await Promise.all([
      // Published schedule
      prisma.schedule.findFirst({
        where: { request: 0, userId: null },
        select: { id: true, name: true }
      }),
      
      // Templates
      prisma.schedule.findMany({
        where: { template: true },
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
      }),
      
      // Previous requests by this manager
      prisma.schedule.findMany({
        where: {
          userId: req.user!.id,
          request: { in: [0, 1] } // accepted requests become request=0, or keep submitted
        },
        select: { id: true, name: true },
        orderBy: { updatedAt: 'desc' },
        take: 10 // Last 10 requests
      })
    ]);
    
    res.json({
      baseOptions: {
        published: publishedSchedule ? [publishedSchedule] : [],
        templates,
        previousRequests
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch base options' });
  }
};