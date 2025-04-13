import request from 'supertest';
import { app } from '../app';

// Set NODE_ENV to 'test' for passport configuration
process.env.NODE_ENV = 'test';

describe('API Endpoints', () => {
  it('should return welcome message on GET /api', async () => {
    const response = await request(app).get('/api');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Welcome to the EveryPoll API!');
  });

  it('should serve the React app on GET /', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toContain('text/html');
  });
});
