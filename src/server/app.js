import Fastify from "fastify";
import fastifyMongodb from "@fastify/mongodb";
import { secrets } from "./secrets/dotenv.js";
import healthRoutes from "./routes/healthRoutes.js";
export function createFastifyApp() {
  const fastify = Fastify({
    logger: {
      level: secrets.node_env === "test" ? "silent" : "info",
    },
  });
  fastify.register(fastifyMongodb, {
    forceClose: true,
    url: secrets.mongo_uri,
    client: secrets.node_env === "test" ? "client" : undefined,
  });
  fastify.register(healthRoutes, {
    prefix: "/health",
  });
  return fastify;
}
