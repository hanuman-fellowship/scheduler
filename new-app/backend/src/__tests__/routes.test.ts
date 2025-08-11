import request from 'supertest';
import app from '../routes';

describe('Routes Integration Tests', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        timestamp: expect.any(String)
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: {
          message: 'Route not found',
          code: 'NOT_FOUND'
        }
      });
    });
  });

  describe('CORS', () => {
    it('should handle preflight requests', async () => {
      const response = await request(app)
        .options('/api/schedules')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'Authorization');
      
      expect(response.status).toBe(204); // CORS preflight returns 204
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Request Logging', () => {
    it('should log requests', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      // The logging middleware should execute without errors
    });
  });

  describe('Route Structure', () => {
    it('should have auth routes defined', async () => {
      // Test that auth routes exist (will return 400 without proper data, which is expected)
      const response = await request(app).post('/api/auth/login');
      expect(response.status).toBe(400); // Should fail without proper auth data
    });

    it('should have user routes defined', async () => {
      // Test that user routes exist (will return 401 without auth, which is expected)
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(401); // Should fail without auth
    });

    it('should have schedule routes defined', async () => {
      // Test that schedule routes exist (will return 401 without auth, which is expected)
      const response = await request(app).get('/api/schedules');
      expect(response.status).toBe(401); // Should fail without auth
    });
  });
});
