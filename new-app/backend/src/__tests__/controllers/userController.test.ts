import request from 'supertest';
import express from 'express';
import { list, create, update, deleteUser } from '../../controllers/userController';
import { login } from '../../controllers/authController';
import { createTestUser, resetTestDatabase } from '../utils/testDb';
import { ensureTestDatabase } from '../utils/testConfig';
import { requireAuth, requireRole } from '../../middleware/auth';

// Create a minimal Express app for testing
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Add auth route for getting tokens
  app.post('/auth/login', login);
  
  // Add test routes with middleware
  app.get('/users', requireAuth, requireRole('operations'), list);
  app.post('/users', requireAuth, requireRole('operations'), create);
  app.put('/users/:id', requireAuth, requireRole('operations'), update);
  app.delete('/users/:id', requireAuth, requireRole('operations'), deleteUser);
  
  return app;
};

describe('UserController', () => {
  let app: express.Application;
  let operationsUser: any;
  let regularUser: any;

  beforeAll(async () => {
    await ensureTestDatabase();
    app = createTestApp();
  });

  beforeEach(async () => {
    await resetTestDatabase();
    
    // Create an operations user for testing
    operationsUser = await createTestUser({
      username: 'operations_user',
      email: 'operations@example.com',
      password: 'password123',
      roles: ['operations']
    });

    // Create a regular user
    regularUser = await createTestUser({
      username: 'regular_user',
      email: 'regular@example.com',
      password: 'password123',
      roles: ['personnel']
    });
  });

  afterAll(async () => {
    await resetTestDatabase();
  });

  const getAuthToken = async (username: string, password: string) => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username, password });
    return response.body.token;
  };

  describe('GET /users', () => {
    it('should list users for operations role', async () => {
      const token = await getAuthToken('operations_user', 'password123');
      
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2); // operations_user + regular_user
      
      const usernames = response.body.map((u: any) => u.username);
      expect(usernames).toContain('operations_user');
      expect(usernames).toContain('regular_user');
    });

    it('should reject access for non-operations role', async () => {
      const token = await getAuthToken('regular_user', 'password123');
      
      await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should reject access without authentication', async () => {
      await request(app)
        .get('/users')
        .expect(401);
    });
  });

  describe('POST /users', () => {
    it('should create user with valid data', async () => {
      const token = await getAuthToken('operations_user', 'password123');
      
      const newUserData = {
        username: 'newuser',
        email: 'new@example.com',
        roles: ['personnel']
      };

      const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUserData)
        .expect(201);

      expect(response.body.username).toBe('newuser');
      expect(response.body.email).toBe('new@example.com');
      expect(response.body.roles).toContain('personnel');
      expect(response.body).toHaveProperty('id');
    });

    it('should reject duplicate username', async () => {
      const token = await getAuthToken('operations_user', 'password123');
      
      const duplicateUserData = {
        username: 'operations_user', // Already exists
        email: 'different@example.com',
        roles: ['personnel']
      };

      const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send(duplicateUserData)
        .expect(409);

      expect(response.body.error.code).toBe('DUPLICATE_USER');
    });

    it('should reject duplicate email', async () => {
      const token = await getAuthToken('operations_user', 'password123');
      
      const duplicateUserData = {
        username: 'differentuser',
        email: 'operations@example.com', // Already exists
        roles: ['personnel']
      };

      const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send(duplicateUserData)
        .expect(409);

      expect(response.body.error.code).toBe('DUPLICATE_USER');
    });

    it('should reject missing required fields', async () => {
      const token = await getAuthToken('operations_user', 'password123');
      
      const incompleteData = {
        username: 'newuser'
        // Missing email and roles
      };

      const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send(incompleteData)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject non-array roles', async () => {
      const token = await getAuthToken('operations_user', 'password123');
      
      const invalidData = {
        username: 'newuser',
        email: 'new@example.com',
        roles: 'personnel' // Should be array
      };

      const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('PUT /users/:id', () => {
    it('should return not implemented', async () => {
      const token = await getAuthToken('operations_user', 'password123');
      
      await request(app)
        .put('/users/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(501);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user', async () => {
      const token = await getAuthToken('operations_user', 'password123');
      
      // Delete the regular user
      await request(app)
        .delete(`/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      // Verify user is deleted by trying to list users
      const listResponse = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const usernames = listResponse.body.map((u: any) => u.username);
      expect(usernames).not.toContain('regular_user');
      expect(usernames).toContain('operations_user');
    });

    it('should reject access for non-operations role', async () => {
      const token = await getAuthToken('regular_user', 'password123');
      
      await request(app)
        .delete('/users/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });
});
