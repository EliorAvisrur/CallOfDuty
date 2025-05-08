import { beforeAll, describe, expect, test } from '@jest/globals';
import { createFastifyApp } from '../src/server/app';
import { secrets } from '../src/server/secrets/dotenv';

describe('Test justice-board endpoints', () => {
  let fastify;

  beforeAll(async () => {
    fastify = await createFastifyApp();
  });

  test('Get justice-board', async () => {
    const res = await fastify.inject({
      method: 'GET',
      url: '/justice-board'
    });
    expect(res.statusCode).toBe(201);
  });

  test("Get soldier's total score", async () => {
    const existedId = '0112909';
    const res = await fastify.inject({
      method: 'GET',
      url: `/justice-board/${existedId}`
    });
    expect(res.statusCode).toBe(200);
  });

  test("Trying to Get unexist soldier's total score should return error", async () => {
    const unexistId = '8888888';
    const res = await fastify.inject({
      method: 'GET',
      url: `/justice-board/${unexistId}`
    });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({
      message: "soldier with this id isn't existed"
    });
  });

  test("Trying to Get soldier's total score with invalid id", async () => {
    const unvalidId = '000';
    const res = await fastify.inject({
      method: 'GET',
      url: `/justice-board/${unvalidId}`
    });
    expect(res.statusCode).toBe(400);
  });
});
