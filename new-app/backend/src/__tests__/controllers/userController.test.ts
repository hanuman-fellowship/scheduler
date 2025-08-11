import request from 'supertest';
import { testApp } from '../utils/testApp';
import { createTestUser, resetTestDatabase } from '../utils/testDbOptimized';

describe('UserController', () => {
  let operationsUser: any;
  let regularUser: any;

  beforeEach(async () => {
    // Reset database before each test for clean state
    await resetTestDatabase();
    
    // Create test users for each test
    operationsUser = await createTestUser({
      username: 'operations_user',
      email: 'operations@example.com',
      password: 'password123',
      roles: ['operations']
    });

    regularUser = await createTestUser({
      username: 'regular_user',
      email: 'regular@example.com',
      password: 'password123',
      roles: ['personnel']
    });
  });

  describe('GET /users', () => {
    it('should list users for operations role', async () => {
      // Login as operations user to get token
      const loginResponse = await request(testApp)
        .post('/auth/login')
        .send({
          username: 'operations_user',
          password: 'password123'
        });

      const operationsToken = loginResponse.body.token;

      const response = await request(testApp)
        .get('/users')
        .set('Authorization', `Bearer ${operationsToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should reject access for non-operations role', async () => {
      // Login as regular user
      const regularLoginResponse = await request(testApp)
        .post('/auth/login')
        .send({
          username: 'regular_user',
          password: 'password123'
        });

      const regularToken = regularLoginResponse.body.token;

      const response = await request(testApp)
        .get('/users')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject access without authentication', async () => {
      const response = await request(testApp)
        .get('/users');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /users', () => {
    it('should create user for operations role', async () => {
      // Login as operations user to get token
      const loginResponse = await request(testApp)
        .post('/auth/login')
        .send({
          username: 'operations_user',
          password: 'password123'
        });

      const operationsToken = loginResponse.body.token;

      const newUser = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        roles: ['personnel']
      };

      const response = await request(testApp)
        .post('/users')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(newUser.username);
      expect(response.body.email).toBe(newUser.email);
    });

    it('should reject user creation for non-operations role', async () => {
      // Login as regular user
      const regularLoginResponse = await request(testApp)
        .post('/auth/login')
        .send({
          username: 'regular_user',
          password: 'password123'
        });

      const regularToken = regularLoginResponse.body.token;

      const newUser = {
        username: 'unauthorized_user',
        email: 'unauthorized@example.com',
        password: 'password123',
        roles: ['personnel']
      };

      const response = await request(testApp)
        .post('/users')
        .set('Authorization', `Bearer ${regularToken}`)
        .send(newUser);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject user creation without authentication', async () => {
      const newUser = {
        username: 'unauthenticated_user',
        email: 'unauthenticated@example.com',
        password: 'password123',
        roles: ['personnel']
      };

      const response = await request(testApp)
        .post('/users')
        .send(newUser);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /users/:id', () => {
    it('should return not implemented', async () => {
      // Login as operations user to get token
      const loginResponse = await request(testApp)
        .post('/auth/login')
        .send({
          username: 'operations_user',
          password: 'password123'
        });

      const operationsToken = loginResponse.body.token;

      const updateData = {
        email: 'updated@example.com',
        roles: ['manager']
      };

      const response = await request(testApp)
        .put(`/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${operationsToken}`)
        .send(updateData);

      expect(response.status).toBe(501);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.code).toBe('NOT_IMPLEMENTED');
    });

    it('should reject user update for non-operations role', async () => {
      // Login as regular user
      const regularLoginResponse = await request(testApp)
        .post('/auth/login')
        .send({
          username: 'regular_user',
          password: 'password123'
        });

      const regularToken = regularLoginResponse.body.token;

      const updateData = {
        email: 'unauthorized_update@example.com'
      };

      const response = await request(testApp)
        .put(`/users/${operationsUser.id}`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user for operations role', async () => {
      // Login as operations user to get token
      const loginResponse = await request(testApp)
        .post('/auth/login')
        .send({
          username: 'operations_user',
          password: 'password123'
        });

      const operationsToken = loginResponse.body.token;

      const response = await request(testApp)
        .delete(`/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${operationsToken}`);

      expect(response.status).toBe(204);
    });

    it('should reject user deletion for non-operations role', async () => {
      // Login as regular user
      const regularLoginResponse = await request(testApp)
        .post('/auth/login')
        .send({
          username: 'regular_user',
          password: 'password123'
        });

      const regularToken = regularLoginResponse.body.token;

      const response = await request(testApp)
        .delete(`/users/${operationsUser.id}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });
});
