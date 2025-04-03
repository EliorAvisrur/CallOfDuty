import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { MongoClient } from "mongodb";
import { createFastifyApp } from "../src/server/app.js";

let connection;
let fastify;

describe("Test duty endpoints", () => {
  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__);
    fastify = await createFastifyApp();
  });
  afterAll(async () => {
    await connection.close();
  });
  describe("Create duty", () => {
    test("POST /duties should return a new soldier", async () => {
      const duty = {
        name: "check5",
        description: "Stand guard at the main entrance.",
        location: [-73.9857, 40.7484],
        startTime: "2025-05-28T08:00:00Z",
        endTime: "2025-05-28T12:00:00Z",
        minRank: 4,
        maxRank: 5,
        constraints: ["No firearms", "Night duty only"],
        soldiersRequired: 2,
        value: 150,
      };
      const res = await fastify.inject({
        method: "POST",
        url: "/duties",
        payload: duty,
      });
      expect(res.statusCode).toBe(201);
    });
  });
  describe("Get duty", () => {
    test("GET /duties should return all exists duties", async () => {
      const res = await fastify.inject({
        method: "GET",
        url: "/duties",
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toBeInstanceOf(Array);
    });
    test("GET /duties with querystring should return all exists duties after query filter", async () => {
      const res = await fastify.inject({
        method: "GET",
        url: "/duties?minRank=4",
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toBeInstanceOf(Array);
    });
    test("GET /duties/:id should return a specific duty by id", async () => {
      const res = await fastify.inject({
        method: "GET",
        url: "/duties/67e4fce10ab77d3ca7637bfd",
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toBeInstanceOf(Object);
    });
  });
  describe("Delete duty", () => {
    test("Delete /duties/:id should delete a duty", async () => {
      const res = await fastify.inject({
        method: "DELETE",
        url: "/duties/67ee6dcf1b388c1077626885",
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toHaveProperty("message");
    });
    test("Delete /duties/:id with wrong id (but same length as id's length)", async () => {
      const res = await fastify.inject({
        method: "DELETE",
        url: "/duties/111111111111111111111111", //length 24
      });
      expect(res.statusCode).toBe(404);
      expect(res.json()).toEqual({
        message: "Cannot read properties of null (reading 'status')",
      });
    });
    test("Delete /duties/:id with wrong id (shorter than id's length)", async () => {
      const res = await fastify.inject({
        method: "DELETE",
        url: "/duties/11111111111111111111111", //length:23 less than normal length (24)
      });
      expect(res.statusCode).toBe(404);
      expect(res.json()).toEqual({
        message:
          "input must be a 24 character hex string, 12 byte Uint8Array, or an integer",
      });
    });
  });
  describe("Patch duty", () => {
    test("Patch /duties/:id with body that includes the properties to update and their new values, should return the updated duty", async () => {
      const updatedData = {
        name: "updated",
        soldiersRequired: 5,
        value: 5,
      };
      const res = await fastify.inject({
        method: "PATCH",
        url: "/duties/67e56838902815dae0406bba",
        payload: updatedData,
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toBeInstanceOf(Object);
    });
    test("Patch /duties/:id with no body should return a error", async () => {
      const res = await fastify.inject({
        method: "PATCH",
        url: "/duties/67e56838902815dae0406bba",
      });
      expect(res.statusCode).toBe(400);
      const result = res.json();
      expect(result.message).toBe("body must be object");
    });
    test("Patch /duties/:id with empty body should return a error", async () => {
      const body = {};
      const res = await fastify.inject({
        method: "PATCH",
        url: "/duties/67e56838902815dae0406bba",
        payload: body,
      });
      expect(res.statusCode).toBe(400);
      const result = res.json();
      expect(result.message).toBe("body must NOT have fewer than 1 properties");
    });
    test("Patch /duties/:id with body that include additional properties should return a error", async () => {
      const body = {
        name: "check",
        soldiersRequired: 3,
        value: 11,
        addition: "addition",
      };
      const res = await fastify.inject({
        method: "PATCH",
        url: "/duties/67e56838902815dae0406bba",
        payload: body,
      });
      expect(res.statusCode).toBe(400);
      const result = res.json();
      expect(result.message).toBe("body must NOT have additional properties");
    });
    test("Patch /duties/:id with body that include properties with wrong values should return a error", async () => {
      const body = {
        name: "c",
        soldiersRequired: 3,
        value: 11,
      };
      const res = await fastify.inject({
        method: "PATCH",
        url: "/duties/67e56838902815dae0406bba",
        payload: body,
      });
      expect(res.statusCode).toBe(400);
    });
  });
});
