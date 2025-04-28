import {
  getJusticeBoardSchema,
  getSoldierScoreById,
} from "../schemas/justice_boardSchema.js";

export function justiceBoardRoutes(fastify) {
  fastify.get("/", { schema: getJusticeBoardSchema }, async (_, reply) => {
    try {
      let justiceBoard = await fastify.mongo.db
        .collection("soldiers")
        .aggregate([
          {
            $lookup: {
              from: "duties",
              let: { soldierId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $in: ["$$soldierId", "$soldiers"] },
                  },
                },
                {
                  $project: { value: 1 },
                },
              ],
              as: "assignedDuties",
            },
          },
          {
            $addFields: {
              score: {
                $sum: "$assignedDuties.value",
              },
            },
          },
        ])
        .toArray();
      justiceBoard = justiceBoard.map((doc) => ({
        _id: doc._id,
        score: doc.score,
      }));
      reply.status(201).send(justiceBoard);
    } catch (error) {
      reply.status(500).send({ status: "error", reason: error.message });
    }
  });
  fastify.get(
    "/:id",
    { schema: getSoldierScoreById },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const soldierArray = await fastify.mongo.db
          .collection("duties")
          .find({ soldiers: id })
          .toArray();
        if (soldierArray.length === 0) {
          return reply
            .status(404)
            .send({ message: "soldier with this id isn't existed" });
        }
        const soldierScore = soldierArray.reduce(
          (sum, doc) => sum + doc.value,
          0
        );
        reply.status(200).send(soldierScore);
      } catch (error) {
        reply.status(500).send({ status: "error", reason: error.message });
      }
    }
  );
}
