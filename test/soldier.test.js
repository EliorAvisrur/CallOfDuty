import { createFastifyApp } from "../src/server/app.js";
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";
import { MongoClient } from "mongodb";

let connection;
let fastify;

describe("Test Soldier endpoints", () => {
  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__);
    fastify = await createFastifyApp();
  });
  afterAll(async () => {
    await connection.close();
  });
  describe("Create soldier", () => {
    test("POST /soldiers with body (with rankName and limitations instead of rankValue) should create a new soldier", async () => {
      const soldierData = {
        _id: "1111111",
        name: "Check Check",
        rankName: "sergeant",
        limitations: ["t1", "t2"],
      };
      const res = await fastify.inject({
        method: "POST",
        url: "/soldiers",
        payload: soldierData,
      });
      expect(res.statusCode).toBe(201);
      expect(res.json()).toEqual({
        _id: "1111111",
        name: "Check Check",
        rank: {
          name: "sergeant",
          value: 2,
        },
        limitations: ["t1", "t2"],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    test("POST /soldiers with body (with rankValue instead of rankName and limitations) should create a new soldier", async () => {
      const soldierData = {
        _id: "1111112",
        name: "Check Check",
        rankValue: 2,
        limitations: ["t1", "t2"],
      };
      const res = await fastify.inject({
        method: "POST",
        url: "/soldiers",
        payload: soldierData,
      });
      expect(res.statusCode).toBe(201);
      expect(res.json()).toEqual({
        _id: "1111112",
        name: "Check Check",
        rank: {
          name: "sergeant",
          value: 2,
        },
        limitations: ["t1", "t2"],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    test("POST /soldiers with wrong Data should return error", async () => {
      const soldierData = {
        _id: "1111111",
        name: "Check Check",
        rankName: "sergeant",
      };
      const res = await fastify.inject({
        method: "POST",
        url: "/soldiers",
        payload: soldierData,
      });
      expect(res.statusCode).toBe(400);
      expect(res.json().statusCode).toBe(400);
      expect(res.json().error).toBe("Bad Request");
    });
  });
  describe("Get soldier", () => {
    const s1Id = "0112929";
    test("GET /soldiers/:id return a 200 status code if the soldier is found in db", async () => {
      const res = await fastify.inject({
        method: "GET",
        url: `/soldiers/${s1Id}`,
      });
      const returnSoldier = res.json();
      expect(res.statusCode).toBe(200);
      expect(returnSoldier._id).toBe(s1Id);
    });
  });
});
