import { createSoldier, getSoldierRankAndName } from "../models/soldier.js";
import {
  deleteSoldierSchema,
  getSoldierByIDSchema,
  getSoldierByQuerySchema,
  patchSoldierSchema,
  postSoldierSchema,
  putLimitationsSchema,
} from "../schemas/soldierSchemas.js";
export function soldierRoutes(fastify) {
  fastify.post("/", { schema: postSoldierSchema }, async (request, reply) => {
    try {
      const newSoldier = createSoldier(request.body);
      await fastify.mongo.db.collection("soldiers").insertOne(newSoldier);
      return reply.code(201).send(newSoldier);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      return reply.code(statusCode).send({ error: message });
    }
  });
  fastify.get(
    "/:id",
    { schema: getSoldierByIDSchema },
    async (request, reply) => {
      const { id } = request.params;
      const soldier = await fastify.mongo.db
        .collection("soldiers")
        .findOne({ _id: id });
      if (!soldier) {
        return reply
          .status(404)
          .send({ message: `Soldier not found with id=${id}` });
      }
      return reply.status(200).send(soldier);
    }
  );

  fastify.get(
    "/",
    { schema: getSoldierByQuerySchema },
    async (request, reply) => {
      const { name, limitations, rankValue, rankName } = request.query;
      const filter = {
        ...(name && { name }),
        ...(limitations?.length > 0 && {
          limitations: { $all: limitations[0].split(",") },
        }),
        ...((rankValue || rankName) && {
          rank: getSoldierRankAndName(rankName, rankValue),
        }),
      };

      const queryResult = await fastify.mongo.db
        .collection("soldiers")
        .find(filter)
        .toArray();
      return reply.status(200).send(queryResult);
    }
  );

  fastify.delete(
    "/:id",
    { schema: deleteSoldierSchema },
    async (request, reply) => {
      const { id } = request.params;
      const result = await fastify.mongo.db
        .collection("soldiers")
        .deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return reply
          .status(404)
          .send({ message: `Soldier with ID ${id} not found!` });
      }
      return reply
        .status(200)
        .send({ message: `Soldier with ID ${id} deleted succesfully` });
    }
  );

  fastify.patch(
    "/:id",
    { schema: patchSoldierSchema },
    async (request, reply) => {
      const { id } = request.params;
      const { name, limitations, rankValue, rankName } = request.body;
      const updateToSoldier = {
        ...(name && { name }),
        ...(limitations?.length > 0 && {
          limitations: limitations.map((limit) => limit.toLowerCase()),
        }),
        ...((rankValue || rankName) && {
          rank: getSoldierRankAndName(rankName, rankValue),
        }),
      };

      const result = await fastify.mongo.db
        .collection("soldiers")
        .findOneAndUpdate(
          { _id: id },
          { $set: updateToSoldier, $currentDate: { updatedAt: true } },
          { returnDocument: "after" }
        );
      if (!result) {
        return reply
          .status(404)
          .send({ message: `Soldier with ID ${id} not found!` });
      }
      return reply.status(200).send(result);
    }
  );

  fastify.put(
    "/:id/limitations",
    { schema: putLimitationsSchema },
    async (request, reply) => {
      const { id } = request.params;
      const body = request.body;
      const result = await fastify.mongo.db
        .collection("soldiers")
        .findOneAndUpdate(
          { _id: id },
          {
            $addToSet: { limitations: { $each: body } },
            $currentDate: { updatedAt: true },
          },
          { returnDocument: "after" }
        );
      if (!result) {
        return reply.status(404).send({
          message: `Soldier with ID ${id} not found or no changes made`,
        });
      }
      return reply.status(200).send(result);
    }
  );
}
