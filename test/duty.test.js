import { beforeAll, describe, expect, test } from '@jest/globals';
import { createFastifyApp } from '../src/server/app.js';
import { secrets } from '../src/server/secrets/dotenv.js';

describe('Test duty endpoints', () => {
  let fastify;
  let idToDelete;
  beforeAll(async () => {
    fastify = await createFastifyApp();
  });

  describe('Create duty', () => {
    test('POST /duties should return a new soldier', async () => {
      const duty = {
        name: 'check5',
        description: 'Stand guard at the main entrance.',
        location: [-73.9857, 40.7484],
        startTime: '2025-05-28T08:00:00Z',
        endTime: '2025-05-28T12:00:00Z',
        minRank: 4,
        maxRank: 5,
        constraints: ['No firearms', 'Night duty only'],
        soldiersRequired: 2,
        value: 150
      };
      const res = await fastify.inject({
        method: 'POST',
        url: '/duties',
        payload: duty
      });
      idToDelete = res.json()._id;
      expect(res.statusCode).toBe(201);
      expect(res.json()).toBeInstanceOf(Object);
    });

    test('POST /duties with duty that its startTime is after or equal to endTime should return a error', async () => {
      const duty = {
        name: 'check5',
        description: 'Stand guard at the main entrance.',
        location: [-73.9857, 40.7484],
        startTime: '2025-05-28T08:00:00Z',
        endTime: '2025-05-28T08:00:00Z',
        minRank: 4,
        maxRank: 5,
        constraints: ['No firearms', 'Night duty only'],
        soldiersRequired: 2,
        value: 150
      };
      const res = await fastify.inject({
        method: 'POST',
        url: '/duties',
        payload: duty
      });
      expect(res.statusCode).toBe(400);
      expect(res.json()).toMatchObject({
        message: expect.stringContaining('endTime must be after startTime')
      });
    });

    test('POST /duties with duty that its startTime before now should return a new soldier', async () => {
      const duty = {
        name: 'check5',
        description: 'Stand guard at the main entrance.',
        location: [-73.9857, 40.7484],
        startTime: '2025-04-01T08:00:00Z',
        endTime: '2025-04-28T12:00:00Z',
        minRank: 4,
        maxRank: 5,
        constraints: ['No firearms', 'Night duty only'],
        soldiersRequired: 2,
        value: 150
      };
      const res = await fastify.inject({
        method: 'POST',
        url: '/duties',
        payload: duty
      });
      expect(res.statusCode).toBe(400);
      expect(res.json()).toMatchObject({
        message: expect.stringContaining(
          'The startTime should be in the future.'
        )
      });
    });
  });

  describe('Get duty', () => {
    test('GET /duties should return all exists duties', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/duties'
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toBeInstanceOf(Array);
    });

    test('GET /duties with querystring should return all exists duties after query filter', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/duties?minRank=4&location=[-73.9857,40.7484]'
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toBeInstanceOf(Array);
    });

    test('GET /duties/:id should return a specific duty by id', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/duties/67e5637bc507962e8140b5f2'
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toBeInstanceOf(Object);
    });
  });

  describe('Delete duty', () => {
    test('Delete /duties/:id should delete a duty', async () => {
      const res = await fastify.inject({
        method: 'DELETE',
        url: `/duties/${idToDelete}`
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toHaveProperty('message');
    });

    test('Delete /duties/:id with wrong id', async () => {
      const wrongId = '111111111111111111111111';
      const res = await fastify.inject({
        method: 'DELETE',
        url: `/duties/${wrongId}` //length 24
      });
      expect(res.statusCode).toBe(400);
      expect(res.json()).toEqual({
        message: `Duty not found with id=${wrongId}`
      });
    });

    test("Delete /duties/:id with wrong id (shorter than id's length)", async () => {
      const res = await fastify.inject({
        method: 'DELETE',
        url: '/duties/11111111111111111111111' //length:23 less than normal length (24)
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('Patch duty', () => {
    test('Patch /duties/:id with body that includes the properties to update and their new values, should return the updated duty', async () => {
      const updatedData = {
        name: 'updated',
        soldiersRequired: 5,
        value: 5
      };
      const res = await fastify.inject({
        method: 'PATCH',
        url: '/duties/67e5637bc507962e8140b5f2',
        payload: updatedData
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toBeInstanceOf(Object);
    });

    test('Patch /duties/:id with no body should return a error', async () => {
      const res = await fastify.inject({
        method: 'PATCH',
        url: '/duties/67e5637bc507962e8140b5f2'
      });
      expect(res.statusCode).toBe(400);
      expect(res.json()).toMatchObject({
        message: expect.stringContaining('body/ Expected object, received null')
      });
    });

    test('Patch /duties/:id with empty body should return a error', async () => {
      const body = {};
      const res = await fastify.inject({
        method: 'PATCH',
        url: '/duties/67e5637bc507962e8140b5f2',
        payload: body
      });
      expect(res.statusCode).toBe(400);
      const result = res.json();
      expect(result.message).toBe("body can't be empty");
    });

    test('Patch /duties/:id with body that include additional properties should return a error', async () => {
      const body = {
        name: 'check',
        soldiersRequired: 3,
        value: 11,
        addition: 'addition'
      };
      const res = await fastify.inject({
        method: 'PATCH',
        url: '/duties/67e5637bc507962e8140b5f2',
        payload: body
      });
      expect(res.statusCode).toBe(400);
      expect(res.json()).toMatchObject({
        message: expect.stringContaining(
          "body/ Unrecognized key(s) in object: 'addition'"
        )
      });
    });

    test('Patch /duties/:id with body that include properties with wrong values should return a error', async () => {
      const body = {
        name: 'c',
        soldiersRequired: 3,
        value: 11
      };
      const res = await fastify.inject({
        method: 'PATCH',
        url: '/duties/67e5637bc507962e8140b5f2',
        payload: body
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('Put duty', () => {
    test('Put /duties/:id/constraints ', async () => {
      const constraintsUpdate = ['sickness', 'kids'];
      const res = await fastify.inject({
        method: 'PUT',
        url: '/duties/67e5637bc507962e8140b5f2/constraints',
        payload: constraintsUpdate
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toBeInstanceOf(Object);
    });

    test('Put /duties/:id/constraints with wrong id should return a error', async () => {
      const constraintsUpdate = ['sickness', 'kids'];
      const res = await fastify.inject({
        method: 'PUT',
        url: '/duties/111111111111111111111111/constraints',
        payload: constraintsUpdate
      });
      expect(res.statusCode).toBe(400);
      expect(res.json()).toHaveProperty('message');
    });
  });
});
