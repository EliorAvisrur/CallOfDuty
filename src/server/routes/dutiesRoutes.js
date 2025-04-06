import { ObjectId } from "mongodb";
import {
  adjustDutyQueryString,
  createDuty,
  filterForSchema,
} from "../models/duty.js";
import {
  deleteDutyByIDSchema,
  getDutyByIDSchema,
  getDutyByQuerySchema,
  patchDutySchema,
  postDutySchema,
  putDutySchema,
} from "../schemas/dutySchema.js";

export async function dutiesRoutes(fastify) {
  fastify.post("/", { schema: postDutySchema }, async (request, reply) => {
    try {
      const newDuty = createDuty(request.body);
      if (newDuty.endTime < newDuty.startTime)
        return reply
          .status(400)
          .send({ message: "The startTime should come before the endTime" });
      if (newDuty.startTime < new Date().toISOString())
        return reply
          .status(400)
          .send({ message: "The startTime should be in the future." });
      const res = await fastify.mongo.db
        .collection("duties")
        .insertOne(newDuty);
      newDuty._id = res.insertedId.toString();
      return reply.status(201).send(newDuty);
    } catch (error) {
      return reply.status(404).send({ message: error.message });
    }
  });
  fastify.get(
    "/",
    {
      schema: getDutyByQuerySchema,
      preValidation: async (request, reply) => {
        adjustDutyQueryString(request.query);
      },
    },
    async (request, reply) => {
      try {
        const filter = filterForSchema(request.query);
        const queryResult = await fastify.mongo.db
          .collection("duties")
          .find(filter)
          .toArray();
        return reply.status(200).send(queryResult);
      } catch (error) {
        return reply.status(404).send({ message: error.message });
      }
    }
  );
  fastify.get("/:id", { schema: getDutyByIDSchema }, async (request, reply) => {
    try {
      const { id } = request.params;
      const duty = await fastify.mongo.db
        .collection("duties")
        .findOne({ _id: new ObjectId(id) });
      if (!duty) {
        return reply
          .status(404)
          .send({ message: `Duty not found with id=${id}` });
      }
      return reply.status(200).send(duty);
    } catch (error) {
      return reply.status(404).send({ message: error.message });
    }
  });
  fastify.delete(
    "/:id",
    { schema: deleteDutyByIDSchema },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const duty = await fastify.mongo.db
          .collection("duties")
          .findOne({ _id: new ObjectId(id) });
        if (duty.status === "scheduled") {
          return reply
            .status(400)
            .send({ message: `Duty is scheduled , so it cannot be deleted` });
        }
        const result = await fastify.mongo.db
          .collection("duties")
          .deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return reply
            .status(404)
            .send({ message: `Duty not found with id=${id}` });
        }
        return reply
          .status(200)
          .send({ message: `Soldier with ID ${id} deleted succesfully` });
      } catch (error) {
        return reply.status(404).send({ message: error.message });
      }
    }
  );
  fastify.patch("/:id", { schema: patchDutySchema }, async (request, reply) => {
    try {
      const { id } = request.params;
      const duty = await fastify.mongo.db
        .collection("duties")
        .findOne({ _id: new ObjectId(id) });
      if (!duty) {
        return reply
          .status(400)
          .send({ message: `Duty not found with id=${id}` });
      }
      if (duty.status === "scheduled") {
        return reply
          .status(400)
          .send({ message: `Duty is scheduled , so it cannot be updated` });
      }
      const newDutyProperties = request.body;
      const updateQuery = {
        $set: newDutyProperties,
      };
      if (newDutyProperties.status && newDutyProperties.status != duty.status) {
        updateQuery.$push = {
          statusHistory: {
            status: newDutyProperties.status,
            date: new Date().toISOString(),
          },
        };
      }
      await fastify.mongo.db
        .collection("duties")
        .updateOne({ _id: new ObjectId(id) }, updateQuery);
      const updatedDuty = await fastify.mongo.db
        .collection("duties")
        .findOne({ _id: new ObjectId(id) });
      return reply.status(200).send(updatedDuty);
    } catch (error) {
      return reply.status(404).send({ message: error.message });
    }
  });
  fastify.put(
    "/:id/constraints",
    { schema: putDutySchema },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const duty = await fastify.mongo.db
          .collection("duties")
          .findOne({ _id: new ObjectId(id) });
        if (!duty) {
          return reply
            .status(400)
            .send({ message: `Duty not found with id=${id}` });
        }
        const updatedDutyInfo = { updatedAt: new Date().toISOString() };
        const updateQuery = {
          $set: updatedDutyInfo,
          $push: {
            constraints: { $each: request.body },
          },
        };
        await fastify.mongo.db
          .collection("duties")
          .updateOne({ _id: new ObjectId(id) }, updateQuery);
        const updatedDuty = await fastify.mongo.db
          .collection("duties")
          .findOne({ _id: new ObjectId(id) });
        return reply.status(200).send(updatedDuty);
      } catch (error) {
        return reply.status(404).send({ message: error.message });
      }
    }
  );
}
