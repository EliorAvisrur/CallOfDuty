import { beforeAll, expect, test, jest } from '@jest/globals';
import { createFastifyApp } from '../src/server/app';
import { secrets } from '../src/server/secrets/dotenv';

describe('Test Health endpoints', () => {
  let fastify;

  beforeAll(async () => {
    fastify = await createFastifyApp();
  });

  test("GET /health should return {'status': 'ok'}", async () => {
    const res = await fastify.inject({
      method: 'GET',
      url: '/health'
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
  });

  test("GET /health/db should return {'status': 'ok'}", async () => {
    const res = await fastify.inject({
      method: 'GET',
      url: '/health/db'
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
  });

  test('GET /health/db should return status 500 when there is a database error', async () => {
    jest.spyOn(fastify.mongo.db, 'command').mockRejectedValue(() => {
      throw new Error('MongoDB connection failed');
    });
    const response = await fastify.inject({
      method: 'GET',
      url: '/health/db'
    });
    expect(response.statusCode).toBe(500);
  });
});
