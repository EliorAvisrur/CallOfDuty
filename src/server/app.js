import Fastify from "fastify";
import fastifyMongodb from "@fastify/mongodb";
import { secrets } from "./secrets/dotenv.js";
import { healthRoutes } from "./routes/healthRoutes.js";
import { soldierRoutes } from "./routes/soldierRoutes.js";
import { dutiesRoutes } from "./routes/dutiesRoutes.js";
import { MongoClient } from "mongodb";
export function createFastifyApp() {
  const fastify = Fastify({
    logger: {
      level: secrets.node_env === "test" ? "silent" : "info",
    },
    ajv: {
      customOptions: {
        removeAdditional: false,
        coerceTypes: false,
        useDefaults: false,
      },
    },
  });
  fastify.register(fastifyMongodb, {
    forceClose: true,
    url: secrets.mongo_uri || "mongodb://localhost:27017/CallOfDuty",
  });
  fastify.ready((err) => {
    if (err) {
      console.error("Error connecting to MongoDB:", err);
      process.exit(1);
    }
    console.log("Connected to MongoDB successfully!");
  });
  fastify.register(healthRoutes, {
    prefix: "/health",
  });
  fastify.register(soldierRoutes, { prefix: "/soldiers" });
  fastify.register(dutiesRoutes, { prefix: "/duties" });
  return fastify;
}
