import { z } from "zod";

const soldierSchema = z
  .object({
    _id: z.string().regex(/^[0-9]{7}$/),
    name: z.string().min(3).max(50),
    rank: z.object({ name: z.string(), value: z.number().int().min(0).max(6) }),
    limitations: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

const messageSchema = z.object({ message: z.string() });

const postSoldierSchema = {
  body: z
    .object({
      _id: z.string().regex(/^[0-9]{7}$/),
      name: z.string().min(3).max(50),
      rankValue: z.number().int().min(0).max(6).optional(),
      rankName: z
        .enum([
          "private",
          "corporal",
          "sergeant",
          "lieutenant",
          "captain",
          "major",
          "colonel",
        ])
        .optional(),
      limitations: z.array(z.string()),
    })
    .strict()
    .refine(
      (data) =>
        (data.rankName && !data.rankValue) ||
        (!data.rankName && data.rankValue),
      {
        message: "Either rankName or rankValue is required, but not both.",
        path: ["rankName", "rankValue"],
      }
    ),
  response: { 201: soldierSchema, 404: messageSchema },
};

const getSoldierByIDSchema = {
  params: z.object({ id: z.string() }),
  response: { 200: soldierSchema, 404: messageSchema },
};

const getSoldierByQuerySchema = {
  querystring: z
    .object({
      name: z.string().min(3).max(50),
      rankValue: z.number().int().min(0).max(6),
      rankName: z.enum([
        "private",
        "corporal",
        "sergeant",
        "lieutenant",
        "captain",
        "major",
        "colonel",
      ]),
      limitations: z.array(z.string()),
    })
    .strict()
    .partial(),
  response: { 200: z.array(soldierSchema), 404: messageSchema },
};

const patchSoldierSchema = {
  params: z.object({ id: z.string() }),
  body: z
    .object({
      name: z.string().min(3).max(50),
      rankValue: z.number().int().min(0).max(6).optional(),
      rankName: z
        .enum([
          "private",
          "corporal",
          "sergeant",
          "lieutenant",
          "captain",
          "major",
          "colonel",
        ])
        .optional(),
      limitations: z.array(z.string()),
    })
    .strict()
    .partial()
    .refine(
      (data) =>
        (data.rankName && !data.rankValue) ||
        (!data.rankName && data.rankValue),
      {
        message: "Either rankName or rankValue is required, but not both.",
        path: ["rankName", "rankValue"],
      }
    ),
  response: { 200: soldierSchema, 404: messageSchema },
};

const putLimitationsSchema = {
  params: z.object({ id: z.string() }),
  body: z.array(z.string()),
  response: { 200: soldierSchema, 404: messageSchema },
};

const deleteSoldierSchema = {
  params: z.object({ id: z.string() }),
  response: { 200: messageSchema, 404: messageSchema },
};

export {
  postSoldierSchema,
  getSoldierByIDSchema,
  getSoldierByQuerySchema,
  patchSoldierSchema,
  putLimitationsSchema,
  deleteSoldierSchema,
  soldierSchema,
};
