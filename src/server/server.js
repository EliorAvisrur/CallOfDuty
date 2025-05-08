import { createFastifyApp } from './app.js';
import { secrets } from './secrets/dotenv.js';

async function startServer() {
  const fastify = await createFastifyApp();
  const port = Number(secrets.port) || 3000;

  try {
    await fastify.listen({ port: port });
    fastify.log.info(`Server listening at ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  const closeConnection = async () => {
    try {
      fastify.log.info('Shutting down server...');
      await fastify.close();
      process.exit(0);
    } catch (error) {
      fastify.log.error('Error during shutdown', error);
      process.exit(1);
    }
  };

  process.on('SIGINT', closeConnection);
  process.on('SIGTERM', closeConnection);
}

startServer();
