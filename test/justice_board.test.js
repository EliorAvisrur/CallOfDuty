import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { MongoClient } from 'mongodb';
import { createFastifyApp } from '../src/server/app';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Test justice-board endpoints', () => {
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
