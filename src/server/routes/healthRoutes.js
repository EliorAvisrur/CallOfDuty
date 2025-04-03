export function healthRoutes(fastify) {
  fastify.get("/", async (_req, reply) => {
    reply.code(200).send({ status: "ok" });
  });
  fastify.get("/db", async (_req, reply) => {
    try {
      await fastify.mongo.db.command({ ping: 1 });
      reply.code(200).send({ status: "ok" });
    } catch (err) {
      reply.code(500).send({ status: "error", reason: err.message });
    }
  });
}
