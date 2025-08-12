import express from 'express';
import asyncHandler from 'express-async-handler';
import cors from 'cors';

import * as authController from './controllers/authController';
import * as userController from './controllers/userController';
import * as scheduleController from './controllers/scheduleController';
import * as peopleController from './controllers/peopleController';
import * as categoriesController from './controllers/categoriesController';
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
  app.post('/api/users', requireAuth, requireRole('operations'), asyncHandler(userController.create));
  app.put('/api/users/:id', requireAuth, requireRole('operations'), asyncHandler(userController.update));
  app.delete('/api/users/:id', requireAuth, requireRole('operations'), asyncHandler(userController.deleteUser));

  // Schedule routes
  app.get('/api/schedules', requireAuth, asyncHandler(scheduleController.list));
  app.get('/api/schedules/current', requireAuth, asyncHandler(scheduleController.getCurrentSchedule));
  app.get('/api/schedules/:id', requireAuth, asyncHandler(scheduleController.get));
  app.post('/api/schedules/copy', requireAuth, asyncHandler(scheduleController.copy));
  app.post('/api/schedules/publish', requireAuth, requireRole('operations'), asyncHandler(scheduleController.publish));
  app.delete('/api/schedules/:id', requireAuth, asyncHandler(scheduleController.deleteSchedule));

  // People management (operations only for now)
  app.get('/api/people', requireAuth, asyncHandler(peopleController.list));
  app.get('/api/people/:id', requireAuth, asyncHandler(peopleController.get));
  app.post('/api/people', requireAuth, requireRole('operations'), asyncHandler(peopleController.create));
  app.put('/api/people/:id', requireAuth, requireRole('operations'), asyncHandler(peopleController.update));
  app.delete('/api/people/:id', requireAuth, requireRole('operations'), asyncHandler(peopleController.deletePerson));

  // Categories management (operations only for now)
  app.get('/api/categories', requireAuth, asyncHandler(categoriesController.list));
  app.get('/api/categories/:id', requireAuth, asyncHandler(categoriesController.get));
  app.post('/api/categories', requireAuth, requireRole('operations'), asyncHandler(categoriesController.create));
  app.put('/api/categories/:id', requireAuth, requireRole('operations'), asyncHandler(categoriesController.update));
  app.delete('/api/categories/:id', requireAuth, requireRole('operations'), asyncHandler(categoriesController.deleteCategory));

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