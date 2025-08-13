import express from 'express';
import asyncHandler from 'express-async-handler';
import cors from 'cors';

import * as authController from './controllers/authController';
import * as userController from './controllers/userController';
import * as scheduleController from './controllers/scheduleController';
import * as peopleController from './controllers/peopleController';
import * as categoriesController from './controllers/categoriesController';
import * as shiftController from './controllers/shiftController';
import * as areaController from './controllers/areaController';
import * as dayController from './controllers/dayController';
import * as scheduleViewController from './controllers/scheduleViewController';
import * as assignmentController from './controllers/assignmentController';
import * as requestController from './controllers/requestController';
import * as scheduleManagementController from './controllers/scheduleManagementController';
import { requireAuth, requireRole } from './middleware/auth';

// Create a function that can be configured for different environments
export const createApp = (options: { 
  enableCors?: boolean; 
  enableLogging?: boolean; 
  enableErrorHandlers?: boolean;
  enableHealthCheck?: boolean;
} = {}) => {
  const {
    enableCors = true,
    enableLogging = true,
    enableErrorHandlers = true,
    enableHealthCheck = true
  } = options;

  const app = express();

  if (enableCors) {
    app.use(
      cors({
        methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    );
  }
  
  app.use(express.json());

  // Request logging (only in production)
  if (enableLogging) {
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      if (req.body && Object.keys(req.body).length > 0) {
        console.log(req.body);
      }
      next();
    });
  }

  // Health check (only in production)
  if (enableHealthCheck) {
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  }

  // Auth routes (no auth required)
  app.post('/api/auth/login', asyncHandler(authController.login));
  app.post('/api/auth/logout', requireAuth, asyncHandler(authController.logout));
  app.post('/api/auth/change-password', requireAuth, asyncHandler(authController.changePassword));

  // User management (operations only)
  app.get('/api/users', requireAuth, requireRole('operations'), asyncHandler(userController.list));
  app.get('/api/users/:id', requireAuth, requireRole('operations'), asyncHandler(userController.get));
  app.post('/api/users', requireAuth, requireRole('operations'), asyncHandler(userController.create));
  app.put('/api/users/:id', requireAuth, requireRole('operations'), asyncHandler(userController.update));
  app.delete('/api/users/:id', requireAuth, requireRole('operations'), asyncHandler(userController.deleteUser));
  app.post('/api/users/reset-password', requireAuth, requireRole('operations'), asyncHandler(userController.resetPassword));

  // Schedule routes
  app.get('/api/schedules', requireAuth, asyncHandler(scheduleController.list));
  app.get('/api/schedules/current', requireAuth, asyncHandler(scheduleController.getCurrentSchedule));
  app.get('/api/schedules/:id', requireAuth, asyncHandler(scheduleController.get));
  app.delete('/api/schedules/:id', requireAuth, asyncHandler(scheduleController.deleteSchedule));

  // People management (operations only for now)
  app.get('/api/people', requireAuth, asyncHandler(peopleController.list));
  app.get('/api/people/by-category', requireAuth, requireRole('operations'), asyncHandler(peopleController.listByCategory));
  app.get('/api/people/restorable', requireAuth, requireRole('operations'), asyncHandler(peopleController.getRestorable));
  app.get('/api/people/:id', requireAuth, asyncHandler(peopleController.get));
  app.post('/api/people', requireAuth, requireRole('operations'), asyncHandler(peopleController.create));
  app.post('/api/people/retire', requireAuth, requireRole('operations'), asyncHandler(peopleController.retire));
  app.post('/api/people/:id/restore', requireAuth, requireRole('operations'), asyncHandler(peopleController.restore));
  app.put('/api/people/:id', requireAuth, requireRole('operations'), asyncHandler(peopleController.update));
  app.delete('/api/people/:id', requireAuth, requireRole('operations'), asyncHandler(peopleController.deletePerson));

  // Categories management (operations only for now)
  app.get('/api/categories', requireAuth, asyncHandler(categoriesController.list));
  app.get('/api/categories/:id', requireAuth, asyncHandler(categoriesController.get));
  app.post('/api/categories', requireAuth, requireRole('operations'), asyncHandler(categoriesController.create));
  app.put('/api/categories/:id', requireAuth, requireRole('operations'), asyncHandler(categoriesController.update));
  app.delete('/api/categories/:id', requireAuth, requireRole('operations'), asyncHandler(categoriesController.deleteCategory));

  // Shift management (operations only for now)
  app.get('/api/shifts', requireAuth, asyncHandler(shiftController.list));
  app.get('/api/shifts/:id', requireAuth, asyncHandler(shiftController.get));
  app.post('/api/shifts', requireAuth, requireRole('operations'), asyncHandler(shiftController.create));
  app.put('/api/shifts/:id', requireAuth, requireRole('operations'), asyncHandler(shiftController.update));
  app.delete('/api/shifts/:id', requireAuth, requireRole('operations'), asyncHandler(shiftController.deleteShift));

  // Assignment management (operations only for now)
  app.get('/api/assignments/shift/:shiftId/available-people', requireAuth, asyncHandler(assignmentController.getAvailablePeopleForShift));
  app.get('/api/assignments/shift/:shiftId', requireAuth, asyncHandler(assignmentController.getShiftAssignments));
  app.post('/api/assignments', requireAuth, requireRole('operations'), asyncHandler(assignmentController.createAssignment));
  app.put('/api/assignments/:id', requireAuth, requireRole('operations'), asyncHandler(assignmentController.updateAssignment));
  app.delete('/api/assignments/:id', requireAuth, requireRole('operations'), asyncHandler(assignmentController.deleteAssignment));
  app.post('/api/assignments/:id/star', requireAuth, requireRole('operations'), asyncHandler(assignmentController.toggleAssignmentStar));

  // Request management
  app.post('/api/requests', requireAuth, requireRole('manager'), asyncHandler(requestController.create));
  app.get('/api/requests/drafts', requireAuth, requireRole('manager'), asyncHandler(requestController.getDrafts));
  app.post('/api/requests/:id/submit', requireAuth, requireRole('manager'), asyncHandler(requestController.submit));
  app.get('/api/requests/submitted', requireAuth, requireRole('operations'), asyncHandler(requestController.getSubmitted));
  app.post('/api/requests/:id/accept', requireAuth, requireRole('operations'), asyncHandler(requestController.accept));
  app.delete('/api/requests/:id', requireAuth, asyncHandler(requestController.deleteRequest)); // Managers and operations can delete
  app.get('/api/requests/base-options/:areaId', requireAuth, requireRole('manager'), asyncHandler(requestController.getBaseOptions));

  // Schedule management
  app.post('/api/schedules/copy', requireAuth, asyncHandler(scheduleManagementController.copySchedule));
  app.post('/api/schedules/templates', requireAuth, requireRole('operations'), asyncHandler(scheduleManagementController.createTemplate));
  app.get('/api/schedules/templates', requireAuth, asyncHandler(scheduleManagementController.getTemplates));
  app.post('/api/schedules/publish', requireAuth, requireRole('operations'), asyncHandler(scheduleManagementController.publishSchedule));
  app.get('/api/schedules/groups', requireAuth, asyncHandler(scheduleManagementController.getScheduleGroups));
  app.get('/api/schedules/published', requireAuth, asyncHandler(scheduleManagementController.getPublishedSchedule));

  // Area management
  app.get('/api/areas', requireAuth, asyncHandler(areaController.list));
  app.get('/api/areas/:id', requireAuth, asyncHandler(areaController.get));
  app.post('/api/areas', requireAuth, requireRole('operations'), asyncHandler(areaController.create));
  app.put('/api/areas/:id', requireAuth, requireRole('operations'), asyncHandler(areaController.update));
  app.delete('/api/areas/:id', requireAuth, requireRole('operations'), asyncHandler(areaController.deleteArea));
  app.post('/api/areas/:id/clear', requireAuth, requireRole('operations'), asyncHandler(areaController.clearArea));

  // Day management (read-only)
  app.get('/api/days', requireAuth, asyncHandler(dayController.list));
  app.get('/api/days/:id', requireAuth, asyncHandler(dayController.get));

  // Schedule view routes
  app.get('/api/areas/:areaId/schedule', requireAuth, asyncHandler(scheduleViewController.getAreaSchedule));
  app.get('/api/people/:personId/schedule', requireAuth, asyncHandler(scheduleViewController.getPersonSchedule));
  app.get('/api/schedule/gaps', requireAuth, asyncHandler(scheduleViewController.getGapsSchedule));

  // Error handlers (only in production)
  if (enableErrorHandlers) {
    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({
        error: {
          message: 'Route not found',
          code: 'NOT_FOUND'
        }
      });
    });

    // Error handler
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Server error:', err);
      res.status(500).json({
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR'
        }
      });
    });
  }

  return app;
};

// Export the default production app
const app = createApp();
export default app;