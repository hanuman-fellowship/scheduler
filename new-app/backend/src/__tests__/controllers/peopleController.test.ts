import request from 'supertest';
import { testApp } from '../utils/testApp';
import { createTestUser, createTestSchedule, resetTestDatabase } from '../utils/testDbOptimized';
import prisma from '../../services/prisma';

describe('PeopleController', () => {
  let operationsUser: any;
  let authToken: string;
  let testCategory: any;
  let testSchedule: any;

  beforeEach(async () => {
    await resetTestDatabase();
    
    // Create operations user
    operationsUser = await createTestUser({
      username: 'operations',
      email: 'ops@example.com',
      password: 'password',
      roles: ['operations']
    });

    // Create a test schedule first
    testSchedule = await createTestSchedule({
      name: 'Test Schedule',
      userId: operationsUser.id,
      template: false,
      request: 0
    });

    // Create test category
    testCategory = await prisma.residentCategory.create({
      data: {
        name: 'Test Category',
        color: '#FF0000',
        scheduleId: testSchedule.id
      }
    });

    // Login to get auth token
    const loginResponse = await request(testApp)
      .post('/api/auth/login')
      .send({
        username: 'operations',
        password: 'password'
      });

    authToken = loginResponse.body.token;
  });

  describe('GET /api/people', () => {
    it('should return empty array when no people exist', async () => {
      const response = await request(testApp)
        .get('/api/people')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should require authentication', async () => {
      const response = await request(testApp)
        .get('/api/people');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/people', () => {
    it('should create a person with valid data', async () => {
      const personData = {
        first: 'John',
        last: 'Doe',
        residentCategoryId: testCategory.id,
        scheduleId: testSchedule.id
      };

      const response = await request(testApp)
        .post('/api/people')
        .set('Authorization', `Bearer ${authToken}`)
        .send(personData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        first: 'John',
        last: 'Doe',
        displayName: 'John',
        category: {
          id: testCategory.id,
          name: 'Test Category',
          color: '#FF0000'
        }
      });
      expect(response.body.id).toBeDefined();
    });

    it('should require operations role', async () => {
      // Create non-operations user
      const personnelUser = await createTestUser({
        username: 'personnel',
        email: 'personnel@example.com', 
        password: 'password',
        roles: ['personnel']
      });

      const loginResponse = await request(testApp)
        .post('/api/auth/login')
        .send({
          username: 'personnel',
          password: 'password'
        });

      const response = await request(testApp)
        .post('/api/people')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send({
          first: 'John',
          last: 'Doe',
          residentCategoryId: testCategory.id,
          scheduleId: testSchedule.id
        });

      expect(response.status).toBe(403);
    });

    it('should validate required fields', async () => {
      const response = await request(testApp)
        .post('/api/people')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should generate display name automatically', async () => {
      const response = await request(testApp)
        .post('/api/people')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          first: 'Jane',
          last: 'Smith',
          residentCategoryId: testCategory.id,
          scheduleId: testSchedule.id
        });

      expect(response.status).toBe(201);
      expect(response.body.displayName).toBe('Jane');
    });
  });

  describe('GET /api/people/:id', () => {
    it('should return person by id', async () => {
      const person = await prisma.person.create({
        data: {
          first: 'Test',
          last: 'Person',
          displayName: 'Test'
        }
      });

      // Create the people schedule relationship
      await prisma.peopleSchedule.create({
        data: {
          personId: person.id,
          residentCategoryId: testCategory.id,
          scheduleId: testSchedule.id
        }
      });

      const response = await request(testApp)
        .get(`/api/people/${person.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(person.id);
      expect(response.body.first).toBe('Test');
    });

    it('should return 404 for non-existent person', async () => {
      const response = await request(testApp)
        .get('/api/people/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/people/:id', () => {
    let testPerson: any;

    beforeEach(async () => {
      testPerson = await prisma.person.create({
        data: {
          first: 'Test',
          last: 'Person',
          displayName: 'Test'
        }
      });

      // Create the people schedule relationship
      await prisma.peopleSchedule.create({
        data: {
          personId: testPerson.id,
          residentCategoryId: testCategory.id,
          scheduleId: testSchedule.id
        }
      });
    });

    it('should update person', async () => {
      const response = await request(testApp)
        .put(`/api/people/${testPerson.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          first: 'Updated',
          last: 'Name'
        });

      expect(response.status).toBe(200);
      expect(response.body.first).toBe('Updated');
      expect(response.body.last).toBe('Name');
    });
  });

  describe('DELETE /api/people/:id', () => {
    it('should delete person', async () => {
      const person = await prisma.person.create({
        data: {
          first: 'Test',
          last: 'Person',
          displayName: 'Test'
        }
      });

      // Create the people schedule relationship
      await prisma.peopleSchedule.create({
        data: {
          personId: person.id,
          residentCategoryId: testCategory.id,
          scheduleId: testSchedule.id
        }
      });

      const response = await request(testApp)
        .delete(`/api/people/${person.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify person was deleted
      const getResponse = await request(testApp)
        .get(`/api/people/${person.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });
  });
});