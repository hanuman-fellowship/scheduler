import request from 'supertest';
import { testApp } from '../utils/testApp';
import { createTestUser, createTestSchedule, resetTestDatabase } from '../utils/testDbOptimized';
import { prisma } from '../utils/testConfig';

describe('ScheduleController', () => {
  let operationsUser: any;
  let regularUser: any;
  let testSchedule: any;

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

    // Create test schedule
    testSchedule = await createTestSchedule({
      name: 'Test Schedule',
      userId: regularUser.id,
      template: false,
      request: 0
    });
  });

  describe('GET /schedules', () => {
    it('should list schedules for authenticated user', async () => {
      // Login as regular user to get token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'regular_user',
          password: 'password123'
        });

      const regularToken = loginResponse.body.token;

      const response = await request(testApp)
        .get('/api/schedules')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mine');
      expect(response.body).not.toHaveProperty('all');
      expect(response.body.mine).toHaveLength(1);
      expect(response.body.mine[0].name).toBe('Test Schedule');
    });

    it('should reject access without authentication', async () => {
      const response = await request(testApp)
        .get('/api/schedules');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /schedules/:id', () => {
    it('should get schedule for owner', async () => {
      // Login as regular user to get token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'regular_user',
          password: 'password123'
        });

      const regularToken = loginResponse.body.token;

      const response = await request(testApp)
        .get(`/api/schedules/${testSchedule.id}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testSchedule.id);
      expect(response.body.name).toBe(testSchedule.name);
    });

    it('should get schedule for operations user', async () => {
      // Login as operations user to get token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'operations_user',
          password: 'password123'
        });

      const operationsToken = loginResponse.body.token;

      const response = await request(testApp)
        .get(`/api/schedules/${testSchedule.id}`)
        .set('Authorization', `Bearer ${operationsToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testSchedule.id);
    });

    it('should reject access for non-owner non-operations user', async () => {
      // Create another user
      const otherUser = await createTestUser({
        username: 'other_user',
        email: 'other@example.com',
        password: 'password123',
        roles: ['personnel']
      });

      const otherLoginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'other_user',
          password: 'password123'
        });

      const otherToken = otherLoginResponse.body.token;

      const response = await request(testApp)
        .get(`/api/schedules/${testSchedule.id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject access without authentication', async () => {
      const response = await request(testApp)
        .get(`/api/schedules/${testSchedule.id}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent schedule', async () => {
      // Login as regular user to get token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'regular_user',
          password: 'password123'
        });

      const regularToken = loginResponse.body.token;

      const response = await request(testApp)
        .get('/api/schedules/99999')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /schedules/:id/copy', () => {
    it('should return not implemented', async () => {
      // Login as regular user to get token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'regular_user',
          password: 'password123'
        });

      const regularToken = loginResponse.body.token;

      const response = await request(testApp)
        .post(`/api/schedules/${testSchedule.id}/copy`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(501);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.code).toBe('NOT_IMPLEMENTED');
    });

    it('should return not implemented for non-owner non-operations user', async () => {
      const otherUser = await createTestUser({
        username: 'copy_user',
        email: 'copy@example.com',
        password: 'password123',
        roles: ['personnel']
      });

      const otherLoginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'copy_user',
          password: 'password123'
        });

      const otherToken = otherLoginResponse.body.token;

      const response = await request(testApp)
        .post(`/api/schedules/${testSchedule.id}/copy`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(501);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.code).toBe('NOT_IMPLEMENTED');
    });
  });

  describe('POST /schedules/:id/publish', () => {
    it('should reject access for non-operations user', async () => {
      // Login as regular user to get token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'regular_user',
          password: 'password123'
        });

      const regularToken = loginResponse.body.token;

      const response = await request(testApp)
        .post(`/api/schedules/${testSchedule.id}/publish`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject access for non-operations user', async () => {
      const otherUser = await createTestUser({
        username: 'publish_user',
        email: 'publish@example.com',
        password: 'password123',
        roles: ['personnel']
      });

      const otherLoginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'publish_user',
          password: 'password123'
        });

      const otherToken = otherLoginResponse.body.token;

      const response = await request(testApp)
        .post(`/api/schedules/${testSchedule.id}/publish`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /schedules/:id', () => {
    it('should delete schedule for owner', async () => {
      // Login as regular user to get token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'regular_user',
          password: 'password123'
        });

      const regularToken = loginResponse.body.token;

      const response = await request(testApp)
        .delete(`/api/schedules/${testSchedule.id}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(204);
    });

    it('should reject deletion for non-owner non-operations user', async () => {
      // Create a new schedule to test deletion
      const newSchedule = await createTestSchedule({
        name: 'Another Test Schedule',
        userId: regularUser.id,
        template: false,
        request: 0
      });

      const otherUser = await createTestUser({
        username: 'delete_user',
        email: 'delete@example.com',
        password: 'password123',
        roles: ['personnel']
      });

      const otherLoginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'delete_user',
          password: 'password123'
        });

      const otherToken = otherLoginResponse.body.token;

      const response = await request(testApp)
        .delete(`/api/schedules/${newSchedule.id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent schedule', async () => {
      // Login as regular user to get token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'regular_user',
          password: 'password123'
        });

      const regularToken = loginResponse.body.token;

      const response = await request(testApp)
        .delete('/api/schedules/99999')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /schedules/current', () => {
    it('should return the Published schedule as current schedule', async () => {
      // First test if the route exists at all
      const testResponse = await request(testApp)
        .get('/api/schedules/current');
      
      console.log('Test route response status:', testResponse.status);
      console.log('Test route response body:', testResponse.body);
      
      // Should be 401 (unauthorized), not 404 (not found)
      expect([401].includes(testResponse.status)).toBe(true);
      
      // Create the Published schedule
      const publishedSchedule = await prisma.schedule.create({
        data: {
          name: 'Published',
          userId: null,
          template: false,
          request: 0
        }
      });

      // Login as operations user to get token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'operations_user',
          password: 'password123'
        });

      const operationsToken = loginResponse.body.token;

      // Test the main route
      const response = await request(testApp)
        .get('/api/schedules/current')
        .set('Authorization', `Bearer ${operationsToken}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Published');
      expect(response.body.userId).toBe(null);
      
      // Should have additional fields from getScheduleDetail
      expect(response.body).toHaveProperty('areas');
      expect(response.body).toHaveProperty('days');
      expect(response.body).toHaveProperty('people');
    });

    it('should require authentication', async () => {
      const response = await request(testApp)
        .get('/api/schedules/current');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 if Published schedule does not exist', async () => {
      // Don't create the Published schedule - test the error case

      // Login as operations user to get token
      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'operations_user',
          password: 'password123'
        });

      const operationsToken = loginResponse.body.token;

      const response = await request(testApp)
        .get('/api/schedules/current')
        .set('Authorization', `Bearer ${operationsToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('CURRENT_SCHEDULE_NOT_FOUND');
    });
  });
});