import request from 'supertest';
import express from 'express';
import searchRouter from '../../src/routes/search';

/**
 * Integration tests for the /api/search endpoint.
 * Covers: valid requests, missing required fields, invalid types, and default values.
 */
describe('/api/search endpoint', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/search', searchRouter);
  });

  it('returns 200 and validated params for a valid request', async () => {
    const res = await request(app)
      .get('/api/search')
      .query({ location: 'San Francisco', minPrice: 100000, maxPrice: 500000 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('params');
    expect(res.body.params.location).toBe('San Francisco');
    expect(res.body.params.minPrice).toBe(100000);
    expect(res.body.params.maxPrice).toBe(500000);
  });

  it('returns 400 if location is missing', async () => {
    const res = await request(app)
      .get('/api/search')
      .query({ minPrice: 100000 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 for invalid type', async () => {
    const res = await request(app)
      .get('/api/search')
      .query({ location: 'NYC', minPrice: 'not-a-number' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('applies default values for page and pageSize', async () => {
    const res = await request(app)
      .get('/api/search')
      .query({ location: 'NYC' });
    expect(res.status).toBe(200);
    expect(res.body.params.page).toBe(1);
    expect(res.body.params.pageSize).toBe(20);
  });

  // Add more edge cases as needed, e.g., minPrice > maxPrice if logic is added
});
