import express from 'express';
import { login, logout, changePassword } from '../../controllers/authController';
import { list as listUsers, create, update, deleteUser } from '../../controllers/userController';
import { list as listSchedules, get, copy, publish, deleteSchedule } from '../../controllers/scheduleController';
import { requireAuth, requireRole } from '../../middleware/auth';

// Create a shared test app factory
export const createTestApp = () => {
  const app = express();
  
  // Middleware
  app.use(express.json());
  
  // Auth routes (no middleware needed for login)
  app.post('/auth/login', login);
  app.post('/auth/logout', requireAuth, logout);
  app.post('/auth/change-password', requireAuth, changePassword);
  
  // User routes (require operations role)
  app.get('/users', requireAuth, requireRole('operations'), listUsers);
  app.post('/users', requireAuth, requireRole('operations'), create);
  app.put('/users/:id', requireAuth, requireRole('operations'), update);
  app.delete('/users/:id', requireAuth, requireRole('operations'), deleteUser);
  
  // Schedule routes (require auth, role checks handled in controllers)
  app.get('/schedules', requireAuth, listSchedules);
  app.get('/schedules/:id', requireAuth, get);
  app.post('/schedules/:id/copy', requireAuth, copy);
  app.post('/schedules/:id/publish', requireAuth, publish);
  app.delete('/schedules/:id', requireAuth, deleteSchedule);
  
  return app;
};

// Export a singleton instance for tests that don't need customization
export const testApp = createTestApp();
