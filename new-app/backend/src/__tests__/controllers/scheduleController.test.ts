import request from 'supertest';
import express from 'express';
import { list, get, copy, publish, deleteSchedule } from '../../controllers/scheduleController';
import { login } from '../../controllers/authController';
import { createTestUser, createTestSchedule, createTestArea, createTestDay, createTestPerson, createTestResidentCategory, resetTestDatabase } from '../utils/testDb';
import { ensureTestDatabase } from '../utils/testConfig';
import { requireAuth, requireRole } from '../../middleware/auth';

// Create a minimal Express app for testing
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Add auth route for getting tokens
  app.post('/auth/login', login);
  
  // Add test routes with middleware
  app.get('/schedules', requireAuth, list);
  app.get('/schedules/:id', requireAuth, get);
  app.post('/schedules/copy', requireAuth, copy);
  app.post('/schedules/publish', requireAuth, requireRole('operations'), publish);
  app.delete('/schedules/:id', requireAuth, deleteSchedule);
  
  return app;
};

describe('ScheduleController', () => {
  let app: express.Application;
  let operationsUser: any;
  let regularUser: any;
  let testSchedule: any;
  let testArea: any;
  let testDay: any;
  let testPerson: any;
  let testCategory: any;

  beforeAll(async () => {
    await ensureTestDatabase();
    app = createTestApp();
  });

  beforeEach(async () => {
    await resetTestDatabase();
    
    // Create users
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

    // Create test schedule for regular user
    testSchedule = await createTestSchedule({
      name: 'Test Schedule',
      userId: regularUser.id,
      template: false,
      request: 0
    });

    // Create test area
    testArea = await createTestArea(testSchedule.id, {
      name: 'Test Area',
      shortName: 'TA'
    });

    // Create test day
    testDay = await createTestDay(testSchedule.id, {
      name: 'Monday',
      dayOfWeek: 2
    });

    // Create test person
    testPerson = await createTestPerson({
      first: 'John',
      last: 'Doe',
      displayName: 'John Doe'
    });

    // Create test category
    testCategory = await createTestResidentCategory(testSchedule.id, {
      name: 'Resident',
      color: '#007bff'
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

  describe('GET /schedules', () => {
    it('should list user schedules for regular user', async () => {
      const token = await getAuthToken('regular_user', 'password123');
      
      const response = await request(app)
        .get('/schedules')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('mine');
      expect(response.body).not.toHaveProperty('all');
      expect(response.body.mine).toHaveLength(1);
      expect(response.body.mine[0].name).toBe('Test Schedule');
    });

    it('should list all schedules for operations user', async () => {
      const token = await getAuthToken('operations_user', 'password123');
      
      const response = await request(app)
        .get('/schedules')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('mine');
      expect(response.body).toHaveProperty('all');
      expect(response.body.mine).toHaveLength(0); // operations user has no schedules
      expect(response.body.all).toHaveLength(1); // but can see regular user's schedule
    });

    it('should reject access without authentication', async () => {
      await request(app)
        .get('/schedules')
        .expect(401);
    });
  });

  describe('GET /schedules/:id', () => {
    it('should get schedule detail for owner', async () => {
      const token = await getAuthToken('regular_user', 'password123');
      
      const response = await request(app)
        .get(`/schedules/${testSchedule.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.id).toBe(testSchedule.id);
      expect(response.body.name).toBe('Test Schedule');
      expect(response.body).toHaveProperty('areas');
      expect(response.body).toHaveProperty('days');
      expect(response.body).toHaveProperty('people');
    });

    it('should get schedule detail for operations user', async () => {
      const token = await getAuthToken('operations_user', 'password123');
      
      const response = await request(app)
        .get(`/schedules/${testSchedule.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.id).toBe(testSchedule.id);
      expect(response.body.name).toBe('Test Schedule');
    });

    it('should reject access for non-owner non-operations user', async () => {
      // Create another user
      const anotherUser = await createTestUser({
        username: 'another_user',
        email: 'another@example.com',
        password: 'password123',
        roles: ['personnel']
      });

      const token = await getAuthToken('another_user', 'password123');
      
      // This should now return 403 Forbidden since the controller properly handles the error
      await request(app)
        .get(`/schedules/${testSchedule.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should reject access without authentication', async () => {
      await request(app)
        .get(`/schedules/${testSchedule.id}`)
        .expect(401);
    });
  });

  describe('POST /schedules/copy', () => {
    it('should return not implemented', async () => {
      const token = await getAuthToken('regular_user', 'password123');
      
      await request(app)
        .post('/schedules/copy')
        .set('Authorization', `Bearer ${token}`)
        .expect(501);
    });
  });

  describe('POST /schedules/publish', () => {
    it('should return not implemented for operations user', async () => {
      const token = await getAuthToken('operations_user', 'password123');
      
      await request(app)
        .post('/schedules/publish')
        .set('Authorization', `Bearer ${token}`)
        .expect(501);
    });

    it('should reject access for non-operations user', async () => {
      const token = await getAuthToken('regular_user', 'password123');
      
      await request(app)
        .post('/schedules/publish')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('DELETE /schedules/:id', () => {
    it('should delete schedule for owner', async () => {
      const token = await getAuthToken('regular_user', 'password123');
      
      await request(app)
        .delete(`/schedules/${testSchedule.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      // Verify schedule is deleted
      const listResponse = await request(app)
        .get('/schedules')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(listResponse.body.mine).toHaveLength(0);
    });

    it('should delete schedule for operations user', async () => {
      const token = await getAuthToken('operations_user', 'password123');
      
      await request(app)
        .delete(`/schedules/${testSchedule.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      // Verify schedule is deleted
      const listResponse = await request(app)
        .get('/schedules')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(listResponse.body.all).toHaveLength(0);
    });

    it('should reject access without authentication', async () => {
      await request(app)
        .delete(`/schedules/${testSchedule.id}`)
        .expect(401);
    });
  });
});