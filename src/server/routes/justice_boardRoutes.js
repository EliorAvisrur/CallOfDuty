import {
  getJusticeBoardSchema,
  getSoldierScoreById
} from '../schemas/justice_boardSchema.js';
import {
  getJustice_Board,
  getSoldierTotalScore,
  isSoldierFound
} from '../utils/justice_boardUtils.js';

export async function justiceBoardRoutes(fastify) {
  const soldiers = await fastify.mongo.db.collection('soldiers');
  const duties = await fastify.mongo.db.collection('duties');

  fastify.get('/', { schema: getJusticeBoardSchema }, async (_, reply) => {
    try {
      const justiceBoard = await getJustice_Board(soldiers);
      reply.status(201).send(justiceBoard);
    } catch (error) {
      reply.status(500).send({ status: 'error', reason: error.message });
    }
  });

  fastify.get(
    '/:id',
    { schema: getSoldierScoreById },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const soldierTotalScore = await getSoldierTotalScore(duties, id);

        const { error } = isSoldierFound(soldierTotalScore.length);
        if (error)
          return reply.status(error.status).send({ message: error.message });

        reply.status(200).send(soldierTotalScore[0].totalScore);
      } catch (error) {
        reply.status(500).send({ status: 'error', reason: error.message });
      }
    }
  );
}
