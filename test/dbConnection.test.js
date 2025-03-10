import { describe, it, expect } from "vitest";
import { connectToDatabase } from "../src/server/db/dbConnection.js";

describe("connectToDatabase", () => {
  it("should throw an error if no URL is provided", () => {
    try {
      connectToDatabase();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Database URL is required");
    }
  });

  it("should connect with the test URL", () => {
    const result = connectToDatabase("test");
    expect(result.status).toBe("connected");
    expect(result.test).toBe(true);
  });

  it("should connect with a non-test URL", () => {
    const result = connectToDatabase("mongodb://localhost:27017");
    expect(result.status).toBe("connected");
    expect(result.test).toBe(false);
  });
});
