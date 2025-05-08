import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const ObjectIdSchema = z.instanceof(ObjectId);
export const ObjectIDStringSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Object ID format');
export const soldierIDSchema = z
  .string()
  .regex(/^[0-9]{7}$/, 'Invalid Soldier ID format');
export const nameSchema = z.string().min(3).max(50);
export const locationSchema = z.tuple([
  z.number().min(-90).max(90),
  z.number().min(-180).max(180)
]);
export const rankSchema = z.number().min(0).max(6);
export const datetimeSchema = z.coerce.date();
export const IDParamsSchema = z.object({ id: ObjectIDStringSchema }).strict();

export const statusSchema = z.object({
  status: z.string(),
  date: datetimeSchema
});

export const futureDateSchema = datetimeSchema.refine(
  date => date > new Date(),
  {
    message: 'Date must be in the future'
  }
);

export const dutySchema = z
  .object({
    _id: z.union([ObjectIdSchema, ObjectIDStringSchema]),
    name: nameSchema,
    description: z.string(),
    location: locationSchema,
    startTime: datetimeSchema,
    endTime: datetimeSchema,
    minRank: rankSchema.optional(),
    maxRank: rankSchema.optional(),
    constraints: z.array(z.string()),
    soldiersRequired: z.number().int().min(1),
    value: z.number().positive(),
    soldiers: z.array(soldierIDSchema),
    status: z.string(),
    statusHistory: z.array(statusSchema),
    createdAt: datetimeSchema,
    updatedAt: datetimeSchema
  })
  .strict();

export const messageSchema = z.object({
  message: z.string()
});
