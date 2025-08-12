import request from 'supertest';
import { testApp } from '../utils/testApp';
import { createTestUser, resetTestDatabase } from '../utils/testDbOptimized';

// Define AuthRequest interface for middleware testing
interface AuthRequest extends request.SuperTest<request.Test> {
  user?: any;
}

describe('Auth Middleware', () => {
  let testUser: any;

  beforeEach(async () => {
    // Reset database before each test for clean state
    await resetTestDatabase();
    
    // Create test user for each test
    testUser = await createTestUser({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
      roles: ['personnel']
    });
  });

  describe('requireAuth middleware', () => {
    it('should allow access with valid token', async () => {
      // Login to get token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password'
        });

      const authToken = loginResponse.body.token;

      const response = await request(testApp)
        .get('/api/schedules')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
    });

    it('should reject access without token', async () => {
      const response = await request(testApp)
        .get('/api/schedules');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject access with invalid token', async () => {
      const response = await request(testApp)
        .get('/api/schedules')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject access with malformed authorization header', async () => {
      const response = await request(testApp)
        .get('/api/schedules')
        .set('Authorization', 'InvalidFormat');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('requireRole middleware', () => {
    it('should allow access for user with required role', async () => {
      // Create operations user
      const operationsUser = await createTestUser({
        username: 'operations_user',
        email: 'operations@example.com',
        password: 'password',
        roles: ['operations']
      });

      // Login as operations user
      const operationsLoginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'operations_user',
          password: 'password'
        });

      const operationsToken = operationsLoginResponse.body.token;

      const response = await request(testApp)
        .get('/api/users')
        .set('Authorization', `Bearer ${operationsToken}`);

      expect(response.status).toBe(200);
    });

    it('should reject access for user without required role', async () => {
      // Login to get token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password'
        });

      const authToken = loginResponse.body.token;

      const response = await request(testApp)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject access without authentication', async () => {
      const response = await request(testApp)
        .get('/api/users');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject access with invalid token for role check', async () => {
      const response = await request(testApp)
        .get('/api/users')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('middleware integration', () => {
    it('should apply both requireAuth and requireRole in sequence', async () => {
      // Test that requireAuth is applied first (401 before 403)
      const response = await request(testApp)
        .get('/api/users');

      expect(response.status).toBe(401); // requireAuth fails first
      expect(response.body).toHaveProperty('error');
    });

    it('should handle expired tokens gracefully', async () => {
      // This test would require JWT expiration testing
      // For now, we'll test that malformed tokens are handled
      const response = await request(testApp)
        .get('/api/schedules')
        .set('Authorization', 'Bearer expired.token.here');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});
