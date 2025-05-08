import { z } from 'zod';
import {
  IDParamsSchema,
  ObjectIDStringSchema,
  datetimeSchema,
  dutySchema,
  futureDateSchema,
  locationSchema,
  messageSchema,
  nameSchema,
  rankSchema
} from '../utils/baseDutySchema.js';

const postDutySchema = {
  body: dutySchema
    .omit({
      _id: true,
      soldiers: true,
      status: true,
      statusHistory: true,
      createdAt: true,
      updatedAt: true,
      startTime: true,
      endTime: true
    })
    .extend({ startTime: datetimeSchema, endTime: datetimeSchema })
    .refine(data => new Date(data.endTime) > new Date(data.startTime), {
      message: 'endTime must be after startTime'
    })
    .refine(data => new Date(data.startTime) > new Date(), {
      message: 'The startTime should be in the future.'
    }),
  response: {
    201: dutySchema,
    404: messageSchema
  }
};

const getDutyByQuerySchema = {
  querystring: dutySchema
    .omit({
      _id: true,
      constraints: true,
      soldiers: true,
      statusHistory: true,
      createdAt: true,
      updatedAt: true
    })
    .extend({
      constraints: z.string()
    })
    .partial(),
  response: {
    200: z.array(dutySchema)
  }
};

const getDutyByIDSchema = {
  params: IDParamsSchema,
  response: {
    200: dutySchema,
    404: messageSchema
  }
};

const deleteDutyByIDSchema = {
  params: IDParamsSchema,
  response: {
    204: messageSchema,
    404: messageSchema
  }
};

const patchDutySchema = {
  params: IDParamsSchema,
  body: z
    .object({
      name: nameSchema,
      description: z.string(),
      location: locationSchema,
      startTime: futureDateSchema,
      endTime: futureDateSchema,
      minRank: rankSchema,
      maxRank: rankSchema,
      constraints: z.array(z.string()),
      soldiersRequired: z.number().int().min(1),
      value: z.number().positive()
    })
    .strict()
    .partial()
    .refine(
      data =>
        data.startTime && data.endTime ? data.endTime > data.startTime : true,
      {
        message: 'endTime must be after startTime'
      }
    ),
  response: {
    200: dutySchema,
    404: messageSchema,
    400: messageSchema
  }
};

const putDutySchema = {
  params: z.object({
    id: ObjectIDStringSchema
  }),
  body: z.array(z.string()),
  response: {
    200: dutySchema
  }
};

export {
  postDutySchema,
  getDutyByQuerySchema,
  getDutyByIDSchema,
  deleteDutyByIDSchema,
  patchDutySchema,
  putDutySchema
};
