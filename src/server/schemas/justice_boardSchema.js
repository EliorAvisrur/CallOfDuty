import { z } from "zod";

const messageSchema = z.object({ message: z.string() });
const soldierIDSchema = z.string().regex(/^[0-9]{7}$/, {
  message: "Soldier ID must be exactly 7 digits.",
});
const scoreSchema = z.number().min(0);
const justiceBoardSchema = z.array(
  z.object({
    _id: soldierIDSchema,
    score: scoreSchema,
  })
);

const getJusticeBoardSchema = {
  response: { 200: justiceBoardSchema },
};

const getSoldierScoreById = {
  params: z.object({ id: soldierIDSchema }).strict(),
  response: { 200: scoreSchema, 404: messageSchema },
};

export { getJusticeBoardSchema, getSoldierScoreById };
