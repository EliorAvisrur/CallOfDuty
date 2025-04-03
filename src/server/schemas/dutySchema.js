const dutySchema = {
  type: "object",
  properties: {
    _id: { type: "string", pattern: "^[0-9a-zA-Z]{24}$" },
    name: { type: "string", minLength: 3, maxLength: 50 },
    description: { type: "string" },
    location: {
      type: "array",
      items: [
        { type: "number", minimum: -90, maximum: 90 },
        { type: "number", minimum: -180, maximum: 180 },
      ],
      minItems: 2,
      maxItems: 2,
    },
    startTime: { type: "string", format: "date-time" },
    endTime: { type: "string", format: "date-time" },
    minRank: { type: "number", minimum: 0, maximum: 6 },
    maxRank: { type: "number", minimum: 0, maximum: 6 },
    constraints: { type: "array", items: { type: "string" } },
    soldiersRequired: { type: "number", minimum: 1 },
    value: { type: "number", minimum: 0 },
    soldiers: { type: "array", items: { type: "object" } },
    status: { type: "string" },
    statusHistory: {
      type: "array",
      items: {
        type: "object",
        properties: {
          status: { type: "string" },
          date: { type: "string", format: "date-time" },
        },
        required: ["status", "date"],
        additionalProperties: false,
      },
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: [
    "name",
    "description",
    "location",
    "startTime",
    "endTime",
    "constraints",
    "soldiersRequired",
    "value",
    "soldiers",
    "status",
    "statusHistory",
    "createdAt",
    "updatedAt",
  ],
};

const messageSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
};

const postDutySchema = {
  body: {
    type: "object",
    properties: {
      _id: { type: "string", pattern: "^[0-9a-zA-Z]{24}$" },
      name: { type: "string", minLength: 3, maxLength: 50 },
      description: { type: "string" },
      location: {
        type: "array",
        items: [
          { type: "number", minimum: -90, maximum: 90 },
          { type: "number", minimum: -180, maximum: 180 },
        ],
        minItems: 2,
        maxItems: 2,
      },
      startTime: { type: "string", format: "date-time" },
      endTime: { type: "string", format: "date-time" },
      minRank: { type: "number", minimum: 0, maximum: 6 },
      maxRank: { type: "number", minimum: 0, maximum: 6 },
      constraints: { type: "array", items: { type: "string" } },
      soldiersRequired: { type: "number", minimum: 1 },
      value: { type: "number", minimum: 0 },
      soldiers: { type: "array", items: { type: "object" } },
      status: { type: "string" },
      statusHistory: {
        type: "array",
        items: {
          type: "object",
          properties: {
            status: { type: "string" },
            date: { type: "string", format: "date-time" },
          },
          required: ["status", "date"],
          additionalProperties: false,
        },
      },
    },
    additionalProperties: false,
    required: [
      "name",
      "description",
      "location",
      "startTime",
      "endTime",
      "value",
    ],
  },
  response: {
    201: dutySchema,
    404: messageSchema,
  },
};

const getDutyByQuerySchema = {
  querystring: {
    type: "object",
    properties: {
      _id: { type: "string", pattern: "^[0-9a-zA-Z]{24}$" },
      name: { type: "string", minLength: 3, maxLength: 50 },
      description: { type: "string" },
      location: {
        type: "array",
        items: [
          { type: "number", minimum: -90, maximum: 90 },
          { type: "number", minimum: -180, maximum: 180 },
        ],
        minItems: 2,
        maxItems: 2,
      },
      startTime: { type: "string", format: "date-time" },
      endTime: { type: "string", format: "date-time" },
      minRank: { type: "number", minimum: 0, maximum: 6 },
      maxRank: { type: "number", minimum: 0, maximum: 6 },
      constraints: { type: "array", items: { type: "string" } },
      soldiersRequired: { type: "number", minimum: 1 },
      value: { type: "number", minimum: 0 },
      soldiers: { type: "array", items: { type: "string" } },
      status: { type: "string" },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: "array",
      items: dutySchema,
    },
  },
};

const getDutyByIDSchema = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
    required: ["id"],
  },
  response: {
    200: dutySchema,
    404: messageSchema,
  },
};

const deleteDutyByIDSchema = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
    required: ["id"],
  },
  response: {
    200: messageSchema,
    404: messageSchema,
  },
};

const patchDutySchema = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
    required: ["id"],
  },
  body: {
    type: "object",
    properties: {
      name: { type: "string", minLength: 3, maxLength: 50 },
      description: { type: "string" },
      location: {
        type: "array",
        items: [
          { type: "number", minimum: -90, maximum: 90 },
          { type: "number", minimum: -180, maximum: 180 },
        ],
        minItems: 2,
        maxItems: 2,
      },
      startTime: { type: "string", format: "date-time" },
      endTime: { type: "string", format: "date-time" },
      minRank: { type: "number", minimum: 0, maximum: 6 },
      maxRank: { type: "number", minimum: 0, maximum: 6 },
      constraints: { type: "array", items: { type: "string" } },
      soldiersRequired: { type: "number", minimum: 1 },
      value: { type: "number", minimum: 0 },
      soldiers: { type: "array", items: { type: "object" } },
      status: { type: "string" },
    },
    additionalProperties: false,
    minProperties: 1,
  },
  response: {
    200: dutySchema,
    404: messageSchema,
  },
};

const putDutySchema = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
    required: ["id"],
  },
  body: {
    type: "array",
    minItems: 1,
  },
  response: {
    200: dutySchema,
    404: messageSchema,
  },
};
export {
  dutySchema,
  messageSchema,
  postDutySchema,
  getDutyByQuerySchema,
  getDutyByIDSchema,
  deleteDutyByIDSchema,
  patchDutySchema,
  putDutySchema,
};
