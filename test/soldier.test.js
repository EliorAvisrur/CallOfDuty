import { createFastifyApp } from '../src/server/app.js';
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  jest,
  test
} from '@jest/globals';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Test Soldier endpoints', () => {
  let mongod;
  let client;
  let db;
  let fastify;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    fastify = await createFastifyApp();
  });

  afterAll(async () => {
    await client.close();
    await mongod.stop();
  });

  describe('Create soldier', () => {
    test('POST /soldiers with body (with rankName and limitations instead of rankValue) should create a new soldier', async () => {
      const soldierData = {
        _id: '1111111',
        name: 'Check Check',
        rankName: 'sergeant',
        limitations: ['t1', 't2']
      };
      const res = await fastify.inject({
        method: 'POST',
        url: '/soldiers',
        payload: soldierData
      });
      expect(res.statusCode).toBe(201);
      expect(res.json()).toEqual({
        _id: '1111111',
        name: 'Check Check',
        rank: {
          name: 'sergeant',
          value: 2
        },
        limitations: ['t1', 't2'],
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    test('POST /soldiers with body (with rankValue instead of rankName and limitations) should create a new soldier', async () => {
      const soldierData = {
        _id: '1111112',
        name: 'Check Check',
        rankValue: 2,
        limitations: ['t1', 't2']
      };
      const res = await fastify.inject({
        method: 'POST',
        url: '/soldiers',
        payload: soldierData
      });
      expect(res.statusCode).toBe(201);
      expect(res.json()).toEqual({
        _id: '1111112',
        name: 'Check Check',
        rank: {
          name: 'sergeant',
          value: 2
        },
        limitations: ['t1', 't2'],
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    test('POST /soldiers with wrong Data should return error', async () => {
      const soldierData = {
        _id: '0112360',
        name: 'Check Check',
        rankName: 'sergeant'
      };
      const res = await fastify.inject({
        method: 'POST',
        url: '/soldiers',
        payload: soldierData
      });
      expect(res.statusCode).toBe(400);
      expect(res.json().statusCode).toBe(400);
      expect(res.json().error).toBe('Bad Request');
    });
  });
  describe('Get soldier', () => {
    const s1Id = '0112929';
    const wrongId = '0000000';
    test('GET /soldiers/:id return a 200 status code if the soldier is found in db', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/soldiers/${s1Id}`
      });
      const returnSoldier = res.json();
      expect(res.statusCode).toBe(200);
      expect(returnSoldier._id).toBe(s1Id);
    });
    test('GET /soldiers/:id with wrong soldier id should return error', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: `/soldiers/${wrongId}`
      });
      expect(res.statusCode).toBe(404);
      expect(res.json()).toEqual({
        message: `Soldier not found with id=${wrongId}`
      });
    });
  });
  describe('Delete soldier', () => {
    test('DELETE /soldiers/:id should delete a duty', async () => {
      const existedId = '1111111';
      const res = await fastify.inject({
        method: 'DELETE',
        url: `/soldiers/${existedId}`
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual({
        message: `Soldier with ID ${existedId} deleted succesfully`
      });
    });
    test('DELETE /soldiers/:id with wrong id should return a error', async () => {
      const wrongId = '0000000';
      const res = await fastify.inject({
        method: 'DELETE',
        url: `/soldiers/${wrongId}`
      });
      expect(res.statusCode).toBe(404);
      expect(res.json()).toEqual({
        message: `Soldier with ID ${wrongId} not found!`
      });
    });
  });
  describe('Patch soldier', () => {
    test('PATCH /soldiers/:id should Patch a duty', async () => {
      const updatedData = {
        name: 'Jame b2'
      };
      const existedId = '0112360';
      const res = await fastify.inject({
        method: 'PATCH',
        url: `/soldiers/${existedId}`,
        payload: updatedData
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toBeInstanceOf(Object);
    });
    test('Patch /soldiers/:id with wrong id should return a error', async () => {
      const updatedData = { name: 'Jame b1', rankValue: 3 };
      const wrongId = '0000000';
      const res = await fastify.inject({
        method: 'PATCH',
        url: `/soldiers/${wrongId}`,
        payload: updatedData
      });
      expect(res.statusCode).toBe(404);
      expect(res.json()).toEqual({
        message: `Soldier with ID ${wrongId} not found!`
      });
    });
  });
  describe('Put soldier limitations', () => {
    test('PUT /soldiers/:id/limitations with array of limitation should update the limitation property and return the updated soldier', async () => {
      const existedId = '0112360';
      const updateLimitationArray = ['sleeping'];
      const res = await fastify.inject({
        method: 'PUT',
        url: `/soldiers/${existedId}/limitations`,
        payload: updateLimitationArray
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toBeInstanceOf(Object);
    });
    test('PUT /soldiers/:id/limitaoions with wrong id should return a error', async () => {
      const wrongId = '0000000';
      const updateLimitationArray = ['sleeping'];
      const res = await fastify.inject({
        method: 'PUT',
        url: `/soldiers/${wrongId}/limitations`,
        payload: updateLimitationArray
      });
      expect(res.statusCode).toBe(404);
      expect(res.json()).toEqual({
        message: `Soldier with ID ${wrongId} not found or no changes made`
      });
    });
  });
});
