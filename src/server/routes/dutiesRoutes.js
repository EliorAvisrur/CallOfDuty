import { adjustDutyToFilter } from '../models/duty.js';
import {
  deleteDutyByIDSchema,
  getDutyByIDSchema,
  getDutyByQuerySchema,
  patchDutySchema,
  postDutySchema,
  putDutySchema
} from '../schemas/dutySchema.js';
import { dutiesController } from '../controllers/dutiesController.js';

export async function dutiesRoutes(fastify) {
  const duties = await fastify.mongo.db.collection('duties');

  fastify.post('/', { schema: postDutySchema }, async (request, reply) => {
    return dutiesController.createDutyHandler(request, reply, duties);
  });
  fastify.get(
    '/',
    {
      schema: getDutyByQuerySchema,
      preValidation: async (request, _) => {
        request.query = adjustDutyToFilter(request.query);
      }
    },
    async (request, reply) => {
      return dutiesController.getDutiesHandler(request, reply, duties);
    }
  );
  fastify.get('/:id', { schema: getDutyByIDSchema }, async (request, reply) => {
    return dutiesController.getDutyByIdHandler(request, reply, duties);
  });
  fastify.delete(
    '/:id',
    { schema: deleteDutyByIDSchema },
    async (request, reply) => {
      return dutiesController.deleteDutyByIdHandler(request, reply, duties);
    }
  );
  fastify.patch('/:id', { schema: patchDutySchema }, async (request, reply) => {
    return dutiesController.patchDutyByIdHandler(request, reply, duties);
  });
  fastify.put(
    '/:id/constraints',
    { schema: putDutySchema },
    async (request, reply) => {
      return dutiesController.putDutyConstraintsHandler(request, reply, duties);
    }
  );
}
