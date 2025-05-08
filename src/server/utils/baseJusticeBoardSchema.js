import { z } from 'zod';

export const messageSchema = z.object({ message: z.string() });
export const soldierIDSchema = z.string().regex(/^[0-9]{7}$/, {
  message: 'Soldier ID must be exactly 7 digits.'
});
export const scoreSchema = z.number().min(0);
export const justiceBoardSchema = z.array(
  z.object({
    _id: soldierIDSchema,
    score: scoreSchema
  })
);
