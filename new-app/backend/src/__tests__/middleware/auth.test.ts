import request from 'supertest';
import express from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import { login } from '../../controllers/authController';
import { createTestUser, resetTestDatabase } from '../utils/testDb';
import { ensureTestDatabase } from '../utils/testConfig';

// Import the AuthRequest interface
interface AuthRequest extends express.Request {
  user?: {
    id: number;
    username: string;
    email: string;
    roles: string[];
  };
}

// Create a minimal Express app for testing
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Add auth route for getting tokens
  app.post('/auth/login', login);
  
  // Add test routes with middleware
  app.get('/protected', requireAuth, (req: AuthRequest, res) => {
    res.json({ message: 'Protected route accessed', user: req.user });
  });
  
  app.get('/operations-only', requireAuth, requireRole('operations'), (req: AuthRequest, res) => {
    res.json({ message: 'Operations route accessed', user: req.user });
  });
  
  app.get('/manager-only', requireAuth, requireRole('manager'), (req: AuthRequest, res) => {
    res.json({ message: 'Manager route accessed', user: req.user });
  });
  
  return app;
};

describe('Auth Middleware', () => {
  let app: express.Application;
  let operationsUser: any;
  let managerUser: any;
  let personnelUser: any;

  beforeAll(async () => {
    await ensureTestDatabase();
    app = createTestApp();
  });

  beforeEach(async () => {
    await resetTestDatabase();
    
    // Create users with different roles
    operationsUser = await createTestUser({
      username: 'operations_user',
      email: 'operations@example.com',
      password: 'password123',
      roles: ['operations']
    });

    managerUser = await createTestUser({
      username: 'manager_user',
      email: 'manager@example.com',
      password: 'password123',
      roles: ['manager']
    });

    personnelUser = await createTestUser({
      username: 'personnel_user',
      email: 'personnel@example.com',
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

  describe('requireAuth middleware', () => {
    it('should allow access with valid token', async () => {
      const token = await getAuthToken('personnel_user', 'password123');
      
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe('Protected route accessed');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe('personnel_user');
    });

    it('should reject access without token', async () => {
      const response = await request(app)
        .get('/protected')
        .expect(401);

      expect(response.body.error.code).toBe('NO_TOKEN');
    });

    it('should reject access with invalid token format', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'InvalidToken')
        .expect(401);

      expect(response.body.error.code).toBe('NO_TOKEN');
    });

    it('should reject access with malformed Bearer token', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer')
        .expect(401);

      expect(response.body.error.code).toBe('NO_TOKEN');
    });

    it('should reject access with invalid JWT token', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer invalid.jwt.token')
        .expect(401);

      expect(response.body.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('requireRole middleware', () => {
    describe('operations role', () => {
      it('should allow operations user access', async () => {
        const token = await getAuthToken('operations_user', 'password123');
        
        const response = await request(app)
          .get('/operations-only')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        expect(response.body.message).toBe('Operations route accessed');
        expect(response.body.user.username).toBe('operations_user');
      });

      it('should reject non-operations user access', async () => {
        const token = await getAuthToken('manager_user', 'password123');
        
        const response = await request(app)
          .get('/operations-only')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);

        expect(response.body.error.code).toBe('FORBIDDEN');
      });

      it('should reject personnel user access', async () => {
        const token = await getAuthToken('personnel_user', 'password123');
        
        const response = await request(app)
          .get('/operations-only')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);

        expect(response.body.error.code).toBe('FORBIDDEN');
      });
    });

    describe('manager role', () => {
      it('should allow manager user access', async () => {
        const token = await getAuthToken('manager_user', 'password123');
        
        const response = await request(app)
          .get('/manager-only')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        expect(response.body.message).toBe('Manager route accessed');
        expect(response.body.user.username).toBe('manager_user');
      });

      it('should reject non-manager user access', async () => {
        const token = await getAuthToken('operations_user', 'password123');
        
        const response = await request(app)
          .get('/manager-only')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);

        expect(response.body.error.code).toBe('FORBIDDEN');
      });

      it('should reject personnel user access', async () => {
        const token = await getAuthToken('personnel_user', 'password123');
        
        const response = await request(app)
          .get('/manager-only')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);

        expect(response.body.error.code).toBe('FORBIDDEN');
      });
    });

    describe('user with multiple roles', () => {
      it('should allow access if user has required role', async () => {
        // Create user with multiple roles
        const multiRoleUser = await createTestUser({
          username: 'multi_role_user',
          email: 'multi@example.com',
          password: 'password123',
          roles: ['personnel', 'manager']
        });

        const token = await getAuthToken('multi_role_user', 'password123');
        
        // Should access manager route
        const managerResponse = await request(app)
          .get('/manager-only')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        expect(managerResponse.body.message).toBe('Manager route accessed');

        // Should access protected route
        const protectedResponse = await request(app)
          .get('/protected')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        expect(protectedResponse.body.message).toBe('Protected route accessed');
      });

      it('should reject access if user lacks required role', async () => {
        // Create user with multiple roles but not operations
        const multiRoleUser = await createTestUser({
          username: 'multi_role_user',
          email: 'multi@example.com',
          password: 'password123',
          roles: ['personnel', 'manager']
        });

        const token = await getAuthToken('multi_role_user', 'password123');
        
        // Should not access operations route
        const response = await request(app)
          .get('/operations-only')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);

        expect(response.body.error.code).toBe('FORBIDDEN');
      });
    });
  });

  describe('middleware chain', () => {
    it('should execute middleware in correct order', async () => {
      const token = await getAuthToken('operations_user', 'password123');
      
      const response = await request(app)
        .get('/operations-only')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Verify both middleware executed
      expect(response.body.user).toBeDefined();
      expect(response.body.message).toBe('Operations route accessed');
    });

    it('should stop at first middleware failure', async () => {
      // No token - should fail at requireAuth
      const response = await request(app)
        .get('/operations-only')
        .expect(401);

      expect(response.body.error.code).toBe('NO_TOKEN');
    });
  });
});
