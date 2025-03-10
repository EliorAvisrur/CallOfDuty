function healthRoutes(fastify) {
  fastify.get("/", async (_req, reply) => {
    reply.code(200).send({ status: "ok" });
  });
  fastify.get("/db", async (_req, reply) => {
    try {
      //i tried to use fastify.mongo.db.command , but for some reason db was undefined so also command dont work.
      // const db = await fastify.mongo.client.db();
      // await db.command({ ping: 1 });
      await fastify.mongo.db.command({ ping: 1 });
      reply.code(200).send({ status: "ok" });
    } catch (err) {
      reply.code(500).send({ status: "error", reason: err.message });
    }
  });
}
export default healthRoutes;
