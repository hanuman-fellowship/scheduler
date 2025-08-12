import express from 'express';
import { login, logout, changePassword } from '../../controllers/authController';
import { list as listUsers, create, update, deleteUser } from '../../controllers/userController';
import { list as listSchedules, get, copy, publish, deleteSchedule, getCurrentSchedule } from '../../controllers/scheduleController';
import { list as listPeople, get as getPerson, create as createPerson, update as updatePerson, deletePerson } from '../../controllers/peopleController';
import { list as listCategories, get as getCategory, create as createCategory, update as updateCategory, deleteCategory } from '../../controllers/categoriesController';
import { requireAuth, requireRole } from '../../middleware/auth';

// Create a shared test app factory
export const createTestApp = () => {
  const app = express();
  
  // Middleware
  app.use(express.json());
  
  // Auth routes (no middleware needed for login)
  app.post('/api/auth/login', login);
  app.post('/api/auth/logout', requireAuth, logout);
  app.post('/api/auth/change-password', requireAuth, changePassword);
  
  // User routes (require operations role)
  app.get('/api/users', requireAuth, requireRole('operations'), listUsers);
  app.post('/api/users', requireAuth, requireRole('operations'), create);
  app.put('/api/users/:id', requireAuth, requireRole('operations'), update);
  app.delete('/api/users/:id', requireAuth, requireRole('operations'), deleteUser);
  
  // Schedule routes (require auth, role checks handled in controllers)
  app.get('/api/schedules', requireAuth, listSchedules);
  app.get('/api/schedules/current', requireAuth, getCurrentSchedule);
  app.get('/api/schedules/:id', requireAuth, get);
  app.post('/api/schedules/:id/copy', requireAuth, copy);
  app.post('/api/schedules/:id/publish', requireAuth, requireRole('operations'), publish);
  app.delete('/api/schedules/:id', requireAuth, deleteSchedule);
  
  // People management routes
  app.get('/api/people', requireAuth, listPeople);
  app.get('/api/people/:id', requireAuth, getPerson);
  app.post('/api/people', requireAuth, requireRole('operations'), createPerson);
  app.put('/api/people/:id', requireAuth, requireRole('operations'), updatePerson);
  app.delete('/api/people/:id', requireAuth, requireRole('operations'), deletePerson);
  
  // Categories management routes
  app.get('/api/categories', requireAuth, listCategories);
  app.get('/api/categories/:id', requireAuth, getCategory);
  app.post('/api/categories', requireAuth, requireRole('operations'), createCategory);
  app.put('/api/categories/:id', requireAuth, requireRole('operations'), updateCategory);
  app.delete('/api/categories/:id', requireAuth, requireRole('operations'), deleteCategory);
  
  return app;
};

// Export a singleton instance for tests that don't need customization
export const testApp = createTestApp();
