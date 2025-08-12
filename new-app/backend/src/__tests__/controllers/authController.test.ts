import request from 'supertest';
import { testApp } from '../utils/testApp';
import { createTestUser, resetTestDatabase } from '../utils/testDbOptimized';

describe('AuthController', () => {
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

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('testuser');
    });

    it('should reject invalid username', async () => {
      const response = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject invalid password', async () => {
      const response = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject missing username', async () => {
      const response = await request(testApp)
        .post('/api/auth/login')
        .send({
          password: 'password'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject missing password', async () => {
      const response = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'testuser'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/logout', () => {
    it('should return 204 status', async () => {
      // First login to get a token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password'
        });

      const authToken = loginResponse.body.token;

      const response = await request(testApp)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);
    });

    it('should reject access without authentication', async () => {
      const response = await request(testApp)
        .post('/api/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/change-password', () => {
    it('should change password with valid old password', async () => {
      // First login to get a token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password'
        });

      const authToken = loginResponse.body.token;

      const response = await request(testApp)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: 'password',
          newPassword: 'newpassword'
        });

      expect(response.status).toBe(204);
      // 204 No Content means no response body
    });

    it('should reject change password with invalid old password', async () => {
      // First login to get a token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password'
        });

      const authToken = loginResponse.body.token;

      const response = await request(testApp)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: 'wrongpassword',
          newPassword: 'newpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject change password without authentication', async () => {
      const response = await request(testApp)
        .post('/api/auth/change-password')
        .send({
          oldPassword: 'password',
          newPassword: 'newpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject change password with short new password', async () => {
      // First login to get a token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password'
        });

      const authToken = loginResponse.body.token;

      const response = await request(testApp)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          oldPassword: 'password',
          newPassword: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
