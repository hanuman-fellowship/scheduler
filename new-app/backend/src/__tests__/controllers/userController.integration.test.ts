import request from 'supertest';
import { testApp } from '../utils/testApp';
import { createTestUser, resetTestDatabase } from '../utils/testDbOptimized';
import type { CreateUserRequest, UpdateUserRequest } from '@shared/types';

describe('UserController Integration', () => {
  let operationsToken: string;

  beforeEach(async () => {
    await resetTestDatabase();
    
    // Create operations user and get auth token
    const operationsUser = await createTestUser({
      username: 'operations',
      email: 'ops@example.com',
      roles: ['operations'],
      password: 'testpass123'
    });
    
    const loginResponse = await request(testApp)
      .post('/api/auth/login')
      .send({
        username: 'operations',
        password: 'testpass123'
      });
    
    operationsToken = loginResponse.body.token;
  });

  describe('GET /api/users', () => {
    it('should return all users for operations role', async () => {
      // Create additional test users
      await createTestUser({
        username: 'manager1',
        email: 'manager@example.com',
        roles: ['manager']
      });

      await createTestUser({
        username: 'personnel1',
        email: 'personnel@example.com',
        roles: ['personnel']
      });

      const response = await request(testApp)
        .get('/api/users')
        .set('Authorization', `Bearer ${operationsToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
    });

    it('should require authentication', async () => {
      const response = await request(testApp)
        .get('/api/users');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should require operations role', async () => {
      const managerUser = await createTestUser({
        username: 'manager',
        email: 'manager@example.com',
        roles: ['manager'],
        password: 'testpass123'
      });

      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'manager',
          password: 'testpass123'
        });

      const response = await request(testApp)
        .get('/api/users')
        .set('Authorization', `Bearer ${loginResponse.body.token}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/users', () => {
    it('should create user successfully', async () => {
      const userData: CreateUserRequest = {
        username: 'newuser',
        email: 'new@example.com',
        roles: ['personnel']
      };

      const response = await request(testApp)
        .post('/api/users')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.username).toBe('newuser');
      expect(response.body.email).toBe('new@example.com');
      expect(response.body.roles).toEqual(['personnel']);
      expect(response.body.tempPassword).toBeTruthy();
    });

    it('should validate required fields', async () => {
      const invalidData = {
        username: '',
        email: 'test@example.com',
        roles: ['personnel']
      };

      const response = await request(testApp)
        .post('/api/users')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should prevent duplicate username', async () => {
      await createTestUser({
        username: 'duplicate',
        email: 'first@example.com',
        roles: ['operations']
      });

      const userData: CreateUserRequest = {
        username: 'duplicate',
        email: 'second@example.com',
        roles: ['personnel']
      };

      const response = await request(testApp)
        .post('/api/users')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send(userData);

      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe('DUPLICATE_USER');
      expect(response.body.error.message).toContain('Username already exists');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user successfully', async () => {
      const testUser = await createTestUser({
        username: 'updateme',
        email: 'update@example.com',
        roles: ['personnel']
      });

      const updateData: UpdateUserRequest = {
        username: 'updated',
        roles: ['manager']
      };

      const response = await request(testApp)
        .put(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${operationsToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe('updated');
      expect(response.body.roles).toEqual(['manager']);
    });

    it('should return 404 for non-existent user', async () => {
      const updateData: UpdateUserRequest = {
        username: 'updated'
      };

      const response = await request(testApp)
        .put('/api/users/999')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user successfully', async () => {
      const testUser = await createTestUser({
        username: 'deleteme',
        email: 'delete@example.com',
        roles: ['personnel']
      });

      const response = await request(testApp)
        .delete(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${operationsToken}`);

      expect(response.status).toBe(204);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(testApp)
        .delete('/api/users/999')
        .set('Authorization', `Bearer ${operationsToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/users/reset-password', () => {
    it('should reset password successfully', async () => {
      const testUser = await createTestUser({
        username: 'resettest',
        email: 'reset@example.com',
        roles: ['manager']
      });

      const response = await request(testApp)
        .post('/api/users/reset-password')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send({ email: 'reset@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password reset successfully');
      expect(response.body.user.email).toBe('reset@example.com');
      expect(response.body.newPassword).toBeTruthy();
    });

    it('should return 404 for non-existent email', async () => {
      const response = await request(testApp)
        .post('/api/users/reset-password')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
      expect(response.body.error.message).toBe('No user found with this email');
    });
  });
});