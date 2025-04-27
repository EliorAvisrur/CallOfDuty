import {
  afterAll,
  beforeAll,
  expect,
  test,
  jest,
  beforeEach,
} from "@jest/globals";
import { MongoClient } from "mongodb";
import { createFastifyApp } from "../src/server/app";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("Test Health endpoints", () => {
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
  test("GET /health should return {'status': 'ok'}", async () => {
    const res = await fastify.inject({
      method: "GET",
      url: "/health",
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });
  test("GET /health/db should return {'status': 'ok'}", async () => {
    const res = await fastify.inject({
      method: "GET",
      url: "/health/db",
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });
  test("GET /health/db should return status 500 when there is a database error", async () => {
    jest.spyOn(fastify.mongo.db, "command").mockRejectedValue(() => {
      throw new Error("MongoDB connection failed");
    });
    const response = await fastify.inject({
      method: "GET",
      url: "/health/db",
    });
    expect(response.statusCode).toBe(500);
  });
});
