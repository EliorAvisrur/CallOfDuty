import { ObjectId } from 'mongodb';
import { createDuty } from '../models/duty.js';
import {
  getUpdatedData,
  validateDeleteOrPatchDutyById,
  isDutyFound,
  appendConstraintsWithTimestamp
} from '../utils/dutyUtils.js';

export const dutiesController = {
  createDutyHandler: async (request, reply, duties) => {
    try {
      const newDuty = createDuty(request.body);
      const res = await duties.insertOne(newDuty);
      newDuty._id = res.insertedId.toString();
      return reply.status(201).send(newDuty);
    } catch (error) {
      return reply.status(404).send({ message: error.message });
    }
  },
  getDutiesHandler: async (request, reply, duties) => {
    try {
      const queryResult = await duties.find(request.query).toArray();
      return reply.status(200).send(queryResult);
    } catch (error) {
      return reply.status(404).send({ message: error.message });
    }
  },
  getDutyByIdHandler: async (request, reply, duties) => {
    try {
      const { id } = request.params;
      const duty = await duties.findOne({ _id: new ObjectId(id) });

      const { error } = isDutyFound(duty, id);
      if (error)
        return reply.status(error.status).send({ message: error.message });

      return reply.status(200).send(duty);
    } catch (error) {
      return reply.status(404).send({ message: error.message });
    }
  },
  deleteDutyByIdHandler: async (request, reply, duties) => {
    try {
      const { id } = request.params;
      const duty = await duties.findOne({ _id: new ObjectId(id) });

      const { error } = validateDeleteOrPatchDutyById(duty, id, 'delete');
      if (error)
        return reply.status(error.status).send({ message: error.message });

      await duties.deleteOne({ _id: new ObjectId(id) });
      return reply
        .status(200)
        .send({ message: `Soldier with ID ${id} deleted succesfully` });
    } catch (error) {
      return reply.status(404).send({ message: error.message });
    }
  },
  patchDutyByIdHandler: async (request, reply, duties) => {
    try {
      const { id } = request.params;
      const duty = await duties.findOne({ _id: new ObjectId(id) });
      const { error } = validateDeleteOrPatchDutyById(duty, id, 'update');
      if (error)
        return reply.status(error.status).send({ message: error.message });

      const newDutyProperties = request.body;
      if (Object.keys(newDutyProperties).length === 0) {
        return reply.status(400).send({ message: "body can't be empty" });
      }

      const { updateData } = getUpdatedData(newDutyProperties);
      await duties.updateOne({ _id: new ObjectId(id) }, updateData);
      const updatedDuty = await duties.findOne({ _id: new ObjectId(id) });
      return reply.status(200).send(updatedDuty);
    } catch (error) {
      return reply.status(404).send({ message: error.message });
    }
  },
  putDutyConstraintsHandler: async (request, reply, duties) => {
    try {
      const { id } = request.params;
      const duty = await duties.findOne({ _id: new ObjectId(id) });

      const { error } = isDutyFound(duty, id);
      if (error)
        return reply.status(error.status).send({ message: error.message });

      const updatedData = appendConstraintsWithTimestamp(request.body);
      await duties.updateOne({ _id: new ObjectId(id) }, updatedData);
      const updatedDuty = await duties.findOne({ _id: new ObjectId(id) });
      return reply.status(200).send(updatedDuty);
    } catch (error) {
      return reply.status(404).send({ message: error.message });
    }
  }
};
