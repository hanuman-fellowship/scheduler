import request from 'supertest';
import { testApp } from '../utils/testApp';
import { createTestUser, createTestSchedule, resetTestDatabase } from '../utils/testDbOptimized';
import prisma from '../../services/prisma';

describe('CategoriesController', () => {
  let operationsUser: any;
  let authToken: string;
  let testSchedule: any;

  beforeEach(async () => {
    await resetTestDatabase();
    
    // Create operations user
    operationsUser = await createTestUser({
      username: 'operations',
      email: 'ops@example.com',
      password: 'password123',
      roles: ['operations']
    });

    // Create a test schedule first
    testSchedule = await createTestSchedule({
      name: 'Test Schedule',
      userId: operationsUser.id,
      template: false,
      request: 0
    });

    // Login to get auth token
    const loginResponse = await request(testApp)
      .post('/api/auth/login')
      .send({
        username: 'operations',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  describe('GET /api/categories', () => {
    it('should return empty array when no categories exist', async () => {
      const response = await request(testApp)
        .get('/api/categories')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should require authentication', async () => {
      const response = await request(testApp)
        .get('/api/categories');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/categories', () => {
    it('should create a category with valid data', async () => {
      const categoryData = {
        name: 'Test Category',
        color: '#FF0000',
        scheduleId: testSchedule.id
      };

      const response = await request(testApp)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send(categoryData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(categoryData);
      expect(response.body.id).toBeDefined();
    });

    it('should require operations role', async () => {
      const personnelUser = await createTestUser({
        username: 'personnel',
        email: 'personnel@example.com',
        password: 'password123',
        roles: ['personnel']
      });

      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'personnel',
          password: 'password123'
        });

      const response = await request(testApp)
        .post('/api/categories')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send({
          name: 'Test Category',
          color: '#FF0000',
          scheduleId: testSchedule.id
        });

      expect(response.status).toBe(403);
    });

    it('should validate required fields', async () => {
      const response = await request(testApp)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate color format', async () => {
      const response = await request(testApp)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Category',
          color: 'not-a-color',
          scheduleId: testSchedule.id
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should prevent duplicate names', async () => {
      // Create first category
      await request(testApp)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Duplicate Name',
          color: '#FF0000',
          scheduleId: testSchedule.id
        });

      // Try to create another with same name
      const response = await request(testApp)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Duplicate Name',
          color: '#00FF00',
          scheduleId: testSchedule.id
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('DUPLICATE_NAME');
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return category by id', async () => {
      const createResponse = await request(testApp)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Category',
          color: '#FF0000',
          scheduleId: testSchedule.id
        });

      const response = await request(testApp)
        .get(`/api/categories/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test Category');
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(testApp)
        .get('/api/categories/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update category', async () => {
      const createResponse = await request(testApp)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Original Name',
          color: '#FF0000',
          scheduleId: testSchedule.id
        });

      const response = await request(testApp)
        .put(`/api/categories/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
          color: '#00FF00'
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
      expect(response.body.color).toBe('#00FF00');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete category', async () => {
      const createResponse = await request(testApp)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'To Delete',
          color: '#FF0000',
          scheduleId: testSchedule.id
        });

      const response = await request(testApp)
        .delete(`/api/categories/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify category was deleted
      const getResponse = await request(testApp)
        .get(`/api/categories/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });
  });
});