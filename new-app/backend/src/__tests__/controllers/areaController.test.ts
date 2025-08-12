import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../../routes';
import { 
  createTestUser, 
  createTestArea,
  createTestSchedule,
  resetTestDatabase 
} from '../utils/testDbOptimized';
import { issueTestToken } from '../utils/authTestHelpers';

const app = createApp({ 
  enableCors: false, 
  enableLogging: false, 
  enableErrorHandlers: false,
  enableHealthCheck: false 
});

describe('Area Controller', () => {
  let operationsUser: any;
  let managerUser: any;
  let testSchedule: any;
  let operationsToken: string;
  let managerToken: string;

  beforeEach(async () => {
    await resetTestDatabase();
    
    // Create users first
    operationsUser = await createTestUser({ 
      username: 'operations', 
      email: 'operations@test.com', 
      password: 'password',
      roles: ['operations'] 
    });
    
    managerUser = await createTestUser({ 
      username: 'manager', 
      email: 'manager@test.com', 
      password: 'password',
      roles: ['manager'] 
    });

    // Create schedule with explicit userId
    testSchedule = await createTestSchedule({ 
      name: 'Test Schedule',
      userId: operationsUser.id
    });

    // Generate auth tokens directly (much faster than login API calls)
    operationsToken = issueTestToken(operationsUser.id, ['operations']);
    managerToken = issueTestToken(managerUser.id, ['manager']);
  });

  describe('GET /api/areas', () => {
    it('should list areas for authenticated user', async () => {
      await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      const response = await request(app)
        .get(`/api/areas?scheduleId=${testSchedule.id}`)
        .set('Authorization', `Bearer ${operationsToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toEqual({
        id: expect.any(Number),
        name: 'Kitchen',
        shortName: 'K',
        scheduleId: testSchedule.id,
        notes: null,
      });
    });

    it('should require authentication', async () => {
      await request(app)
        .get(`/api/areas?scheduleId=${testSchedule.id}`)
        .expect(401);
    });

    it('should require valid schedule ID', async () => {
      await request(app)
        .get('/api/areas')
        .set('Authorization', `Bearer ${operationsToken}`)
        .expect(400);

      await request(app)
        .get('/api/areas?scheduleId=invalid')
        .set('Authorization', `Bearer ${operationsToken}`)
        .expect(400);
    });
  });

  describe('GET /api/areas/:id', () => {
    it('should get area by id', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K',
        notes: 'Test notes'
      });

      const response = await request(app)
        .get(`/api/areas/${area.id}`)
        .set('Authorization', `Bearer ${operationsToken}`)
        .expect(200);

      expect(response.body).toEqual({
        id: area.id,
        name: 'Kitchen',
        shortName: 'K',
        scheduleId: testSchedule.id,
        notes: 'Test notes',
      });
    });

    it('should return 404 for non-existent area', async () => {
      await request(app)
        .get('/api/areas/999999')
        .set('Authorization', `Bearer ${operationsToken}`)
        .expect(404);
    });

    it('should require authentication', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      await request(app)
        .get(`/api/areas/${area.id}`)
        .expect(401);
    });
  });

  describe('POST /api/areas', () => {
    it('should create area with valid data', async () => {
      const areaData = {
        name: 'Kitchen',
        shortName: 'K',
        notes: 'Main kitchen area',
        scheduleId: testSchedule.id,
      };

      const response = await request(app)
        .post('/api/areas')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send(areaData)
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(Number),
        name: 'Kitchen',
        shortName: 'K',
        notes: 'Main kitchen area',
        scheduleId: testSchedule.id,
      });
    });

    it('should create area without notes', async () => {
      const areaData = {
        name: 'Dining Room',
        shortName: 'DR',
        scheduleId: testSchedule.id,
      };

      const response = await request(app)
        .post('/api/areas')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send(areaData)
        .expect(201);

      expect(response.body.notes).toBeNull();
    });

    it('should require operations role', async () => {
      const areaData = {
        name: 'Kitchen',
        shortName: 'K',
        scheduleId: testSchedule.id,
      };

      await request(app)
        .post('/api/areas')
        .set('Authorization', `Bearer ${managerToken}`)
        .send(areaData)
        .expect(403);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/areas')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send({
          name: '', // Invalid
          shortName: 'K',
          scheduleId: testSchedule.id,
        })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/areas')
        .send({
          name: 'Kitchen',
          shortName: 'K',
          scheduleId: testSchedule.id,
        })
        .expect(401);
    });
  });

  describe('PUT /api/areas/:id', () => {
    it('should update area with valid data', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      const updateData = {
        name: 'Main Kitchen',
        shortName: 'MK',
        notes: 'Updated notes',
      };

      const response = await request(app)
        .put(`/api/areas/${area.id}`)
        .set('Authorization', `Bearer ${operationsToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual({
        id: area.id,
        name: 'Main Kitchen',
        shortName: 'MK',
        notes: 'Updated notes',
        scheduleId: testSchedule.id,
      });
    });

    it('should update only provided fields', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K',
        notes: 'Original notes'
      });

      const response = await request(app)
        .put(`/api/areas/${area.id}`)
        .set('Authorization', `Bearer ${operationsToken}`)
        .send({ name: 'Main Kitchen' })
        .expect(200);

      expect(response.body.name).toBe('Main Kitchen');
      expect(response.body.shortName).toBe('K'); // Unchanged
      expect(response.body.notes).toBe('Original notes'); // Unchanged
    });

    it('should return 404 for non-existent area', async () => {
      await request(app)
        .put('/api/areas/999999')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send({ name: 'Test' })
        .expect(404);
    });

    it('should require operations role', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      await request(app)
        .put(`/api/areas/${area.id}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ name: 'Updated' })
        .expect(403);
    });

    it('should validate input data', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      const response = await request(app)
        .put(`/api/areas/${area.id}`)
        .set('Authorization', `Bearer ${operationsToken}`)
        .send({ name: '' }) // Invalid
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('DELETE /api/areas/:id', () => {
    it('should delete area', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      await request(app)
        .delete(`/api/areas/${area.id}`)
        .set('Authorization', `Bearer ${operationsToken}`)
        .expect(204);

      // Verify deletion
      await request(app)
        .get(`/api/areas/${area.id}`)
        .set('Authorization', `Bearer ${operationsToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent area', async () => {
      await request(app)
        .delete('/api/areas/999999')
        .set('Authorization', `Bearer ${operationsToken}`)
        .expect(404);
    });

    it('should require operations role', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      await request(app)
        .delete(`/api/areas/${area.id}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(403);
    });

    it('should require authentication', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      await request(app)
        .delete(`/api/areas/${area.id}`)
        .expect(401);
    });
  });

  describe('POST /api/areas/:id/clear', () => {
    it('should clear area shifts', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      await request(app)
        .post(`/api/areas/${area.id}/clear`)
        .set('Authorization', `Bearer ${operationsToken}`)
        .expect(204);

      // Area should still exist
      await request(app)
        .get(`/api/areas/${area.id}`)
        .set('Authorization', `Bearer ${operationsToken}`)
        .expect(200);
    });

    it('should require operations role', async () => {
      const area = await createTestArea(testSchedule.id, { 
        name: 'Kitchen', 
        shortName: 'K'
      });

      await request(app)
        .post(`/api/areas/${area.id}/clear`)
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(403);
    });

    it('should handle invalid area ID', async () => {
      await request(app)
        .post('/api/areas/invalid/clear')
        .set('Authorization', `Bearer ${operationsToken}`)
        .expect(400);
    });
  });
});