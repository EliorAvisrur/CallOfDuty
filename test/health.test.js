import {
  describe,
  it,
  vi,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "vitest";
import { createFastifyApp } from "../src/server/app.js";
let fastify;

describe("Health check endpoints", () => {
  const mockDb = {
    command: vi.fn(),
  };
  beforeAll(async () => {
    fastify = await createFastifyApp();
    fastify.mongo = {
      db: mockDb,
      client: { close: vi.fn() },
    };
  });
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterAll(async () => {
    await fastify.close();
  });
  it("GET /health should return {'status': 'ok'}", async () => {
    const res = await fastify.inject({
      method: "GET",
      url: "/health",
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });
  it("GET /health/db should return {'status': 'ok'}", async () => {
    //vi.spyOn(fastify.mongo.db, "command").mockResolvedValue({ ping: 1 });
    //the above code in the comment is work too
    //mockDb.command.mockResolvedValue({ ping: 1 });
    const res = await fastify.inject({
      method: "GET",
      url: "/health/db",
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });
  it("GET /health/db should return 500 when error", async () => {
    mockDb.command.mockRejectedValue(new Error("Mocked mongoDB error"));
    fastify.mongo = {
      db: mockDb,
      client: { close: vi.fn() },
    };
    const res = await fastify.inject({
      method: "GET",
      url: "/health/db",
    });
    expect(res.statusCode).toBe(500);
    expect(res.json().status).toEqual("error");
  });
});
