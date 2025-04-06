import { createFastifyApp } from "./app.js";
import { secrets } from "./secrets/dotenv.js";

const fastify = createFastifyApp();
const port = Number(secrets.port);

const start = async () => {
  try {
    await fastify.listen({ port: port });
    fastify.log.info(`Server listening at ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
const closeConnection = async () => {
  fastify.log.info("Shutting down server...");
  await fastify.close();
  process.exit(0);
};
start();
process.on("SIGINT", closeConnection);
process.on("SIGTERM", closeConnection);
