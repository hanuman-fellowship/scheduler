import request from 'supertest';
import express from 'express';
import { login, logout, changePassword } from '../../controllers/authController';
import { createTestUser, resetTestDatabase } from '../utils/testDb';
import { ensureTestDatabase } from '../utils/testConfig';
import { requireAuth } from '../../middleware/auth';

// Create a minimal Express app for testing
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Add test routes
  app.post('/auth/login', login);
  app.post('/auth/logout', requireAuth, logout);
  app.post('/auth/change-password', requireAuth, changePassword);
  
  return app;
};

describe('AuthController', () => {
  let app: express.Application;
  let testUser: any;

  beforeAll(async () => {
    await ensureTestDatabase();
    app = createTestApp();
  });

  beforeEach(async () => {
    await resetTestDatabase();
    testUser = await createTestUser({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      roles: ['personnel']
    });
  });

  afterAll(async () => {
    await resetTestDatabase();
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.roles).toContain('personnel');
    });

    it('should reject invalid username', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject missing username', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          password: 'password123'
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject missing password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser'
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /auth/logout', () => {
    it('should return 204 status', async () => {
      // First login to get a token
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      const token = loginResponse.body.token;

      await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('should reject access without authentication', async () => {
      await request(app)
        .post('/auth/logout')
        .expect(401);
    });
  });

  describe('POST /auth/change-password', () => {
    it('should change password with valid old password', async () => {
      // First login to get a token
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      const token = loginResponse.body.token;

      // Change password
      await request(app)
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          oldPassword: 'password123',
          newPassword: 'newpassword456'
        })
        .expect(204);

      // Verify new password works
      await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'newpassword456'
        })
        .expect(200);
    });

    it('should reject change password with invalid old password', async () => {
      // First login to get a token
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      const token = loginResponse.body.token;

      // Try to change password with wrong old password
      const response = await request(app)
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          oldPassword: 'wrongpassword',
          newPassword: 'newpassword456'
        })
        .expect(400);

      expect(response.body.error.code).toBe('INVALID_PASSWORD');
    });

    it('should reject change password without authentication', async () => {
      const response = await request(app)
        .post('/auth/change-password')
        .send({
          oldPassword: 'password123',
          newPassword: 'newpassword456'
        })
        .expect(401);

      expect(response.body.error.code).toBe('NO_TOKEN');
    });

    it('should reject change password with short new password', async () => {
      // First login to get a token
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      const token = loginResponse.body.token;

      // Try to change password with short new password
      const response = await request(app)
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          oldPassword: 'password123',
          newPassword: '123'
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
