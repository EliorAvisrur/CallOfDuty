import { z } from 'zod';
import {
  messageSchema,
  justiceBoardSchema,
  scoreSchema,
  soldierIDSchema
} from '../utils/baseJusticeBoardSchema.js';

const getJusticeBoardSchema = {
  response: { 200: justiceBoardSchema }
};

const getSoldierScoreById = {
  params: z.object({ id: soldierIDSchema }).strict(),
  response: { 200: scoreSchema, 404: messageSchema }
};

export { getJusticeBoardSchema, getSoldierScoreById };
