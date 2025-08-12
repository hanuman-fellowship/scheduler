import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import { createTestApp } from '../utils/testApp';
import { resetTestDatabase, createTestUser, createTestSchedule, createTestArea, createTestDay } from '../utils/testDbOptimized';
import { timeStringToSeconds } from '@shared/types';
import type { Express } from 'express';

describe('shiftController', () => {
  let app: Express;
  let operationsToken: string;
  let managerToken: string;
  let schedule: any;
  let area: any;
  let day: any;

  beforeEach(async () => {
    await resetTestDatabase();
    app = createTestApp();

    // Create test users and get tokens
    const operationsUser = await createTestUser({
      username: 'operations',
      email: 'operations@test.com',
      roles: ['operations']
    });
    const managerUser = await createTestUser({
      username: 'manager',
      email: 'manager@test.com',
      roles: ['manager']
    });

    // Login to get tokens
    const opsLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'operations',
        password: 'password'
      });
    operationsToken = opsLoginResponse.body.token;

    const managerLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'manager',
        password: 'password'
      });
    managerToken = managerLoginResponse.body.token;

    // Create test data
    const user = await createTestUser({ username: 'scheduleowner', roles: ['operations'] });
    schedule = await createTestSchedule({ name: 'Test Schedule', userId: user.id });
    area = await createTestArea(schedule.id, { name: 'Kitchen', shortName: 'K' });
    day = await createTestDay(schedule.id, { name: 'Monday', dayOfWeek: 2 });
  });

  afterEach(async () => {
    await resetTestDatabase();
  });

  describe('POST /api/shifts', () => {
    it('should create shift with valid data', async () => {
      const shiftData = {
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: timeStringToSeconds('09:00:00'),
        endAtSeconds: timeStringToSeconds('17:00:00'),
        numPeople: 2,
        scheduleId: schedule.id,
      };

      const response = await request(app)
        .post('/api/shifts')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send(shiftData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: timeStringToSeconds('09:00:00'),
        endAtSeconds: timeStringToSeconds('17:00:00'),
        numPeople: 2,
        scheduleId: schedule.id,
      });
      expect(response.body.id).toBeDefined();
    });

    it('should require operations role', async () => {
      const shiftData = {
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: timeStringToSeconds('09:00:00'),
        endAtSeconds: timeStringToSeconds('17:00:00'),
        numPeople: 1,
        scheduleId: schedule.id,
      };

      const response = await request(app)
        .post('/api/shifts')
        .set('Authorization', `Bearer ${managerToken}`)
        .send(shiftData);

      expect(response.status).toBe(403);
    });

    it('should return 400 for invalid time range', async () => {
      const shiftData = {
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: timeStringToSeconds('17:00:00'),
        endAtSeconds: timeStringToSeconds('09:00:00'), // End before start
        numPeople: 1,
        scheduleId: schedule.id,
      };

      const response = await request(app)
        .post('/api/shifts')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send(shiftData);

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('End time must be after start time');
    });

    it('should return 400 for missing required fields', async () => {
      const shiftData = {
        areaId: area.id,
        // Missing dayId, start, end, numPeople, scheduleId
      };

      const response = await request(app)
        .post('/api/shifts')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send(shiftData);

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/shifts')
        .send({});

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/shifts', () => {
    it('should return shifts for schedule', async () => {
      // Create a test shift first
      const shiftData = {
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: timeStringToSeconds('09:00:00'),
        endAtSeconds: timeStringToSeconds('17:00:00'),
        numPeople: 1,
        scheduleId: schedule.id,
      };

      await request(app)
        .post('/api/shifts')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send(shiftData);

      const response = await request(app)
        .get(`/api/shifts?scheduleId=${schedule.id}`)
        .set('Authorization', `Bearer ${operationsToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        areaId: area.id,
        dayId: day.id,
        startAtSeconds: timeStringToSeconds('09:00:00'),
        endAtSeconds: timeStringToSeconds('17:00:00'),
        numPeople: 1,
      });
    });

    it('should return 400 when schedule ID is missing', async () => {
      const response = await request(app)
        .get('/api/shifts')
        .set('Authorization', `Bearer ${operationsToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Valid schedule ID is required');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/shifts?scheduleId=1');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/shifts/:id', () => {
    it('should update shift with valid data', async () => {
      // Create a shift first
      const createResponse = await request(app)
        .post('/api/shifts')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send({
          areaId: area.id,
          dayId: day.id,
          startAtSeconds: timeStringToSeconds('09:00:00'),
          endAtSeconds: timeStringToSeconds('17:00:00'),
          numPeople: 1,
          scheduleId: schedule.id,
        });

      const shiftId = createResponse.body.id;

      const updateData = {
        startAtSeconds: timeStringToSeconds('10:00:00'),
        endAtSeconds: timeStringToSeconds('18:00:00'),
        numPeople: 3,
      };

      const response = await request(app)
        .put(`/api/shifts/${shiftId}`)
        .set('Authorization', `Bearer ${operationsToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: shiftId,
        startAtSeconds: timeStringToSeconds('10:00:00'),
        endAtSeconds: timeStringToSeconds('18:00:00'),
        numPeople: 3,
      });
    });

    it('should return 404 for non-existent shift', async () => {
      const response = await request(app)
        .put('/api/shifts/999')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send({ numPeople: 2 });

      expect(response.status).toBe(404);
    });

    it('should require operations role', async () => {
      const response = await request(app)
        .put('/api/shifts/1')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ numPeople: 2 });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/shifts/:id', () => {
    it('should delete existing shift', async () => {
      // Create a shift first
      const createResponse = await request(app)
        .post('/api/shifts')
        .set('Authorization', `Bearer ${operationsToken}`)
        .send({
          areaId: area.id,
          dayId: day.id,
          startAtSeconds: timeStringToSeconds('09:00:00'),
          endAtSeconds: timeStringToSeconds('17:00:00'),
          numPeople: 1,
          scheduleId: schedule.id,
        });

      const shiftId = createResponse.body.id;

      const response = await request(app)
        .delete(`/api/shifts/${shiftId}`)
        .set('Authorization', `Bearer ${operationsToken}`);

      expect(response.status).toBe(204);

      // Verify shift is deleted
      const getResponse = await request(app)
        .get(`/api/shifts/${shiftId}`)
        .set('Authorization', `Bearer ${operationsToken}`);

      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent shift', async () => {
      const response = await request(app)
        .delete('/api/shifts/999')
        .set('Authorization', `Bearer ${operationsToken}`);

      expect(response.status).toBe(404);
    });

    it('should require operations role', async () => {
      const response = await request(app)
        .delete('/api/shifts/1')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(403);
    });
  });
});