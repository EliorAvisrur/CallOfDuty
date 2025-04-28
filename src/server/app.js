import Fastify from "fastify";
import fastifyMongodb from "@fastify/mongodb";
import { secrets } from "./secrets/dotenv.js";
import { loggerConfig } from "./config/logger.js";
import {
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";

import { healthRoutes } from "./routes/healthRoutes.js";
import { soldierRoutes } from "./routes/soldierRoutes.js";
import { dutiesRoutes } from "./routes/dutiesRoutes.js";
import { justiceBoardRoutes } from "./routes/justice_boardRoutes.js";

export function createFastifyApp() {
  const fastify = Fastify({
    logger: loggerConfig,
    ajv: {
      customOptions: {
        removeAdditional: false,
        coerceTypes: false,
        useDefaults: false,
      },
    },
  });

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
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

  fastify.register(healthRoutes, { prefix: "/health" });
  fastify.register(soldierRoutes, { prefix: "/soldiers" });
  fastify.register(dutiesRoutes, { prefix: "/duties" });
  fastify.register(justiceBoardRoutes, { prefix: "/justice-board" });

  return fastify;
}
