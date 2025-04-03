const soldierSchema = {
  type: "object",
  properties: {
    _id: { type: "string", pattern: "^[0-9]{7}$" },
    name: { type: "string", minLength: 3, maxLength: 50 },
    rank: {
      type: "object",
      properties: {
        name: { type: "string" },
        value: { type: "integer", minimum: 0, maximum: 6 },
      },
      required: ["name", "value"],
    },
    limitations: { type: "array", items: { type: "string" } },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: ["_id", "name", "rank", "limitations"],
  additionalProperties: false,
};

const messageSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
};

const patchSoldierSchema = {
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
      rankValue: { type: "integer", minimum: 0, maximum: 6 },
      rankName: {
        type: "string",
        enum: [
          "private",
          "corporal",
          "sergeant",
          "lieutenant",
          "captain",
          "major",
          "colonel",
        ],
      },
      limitations: { type: "array", items: { type: "string" } },
    },
    anyOf: [
      { required: ["rankValue"], not: { required: ["rankName"] } },
      { required: ["rankName"], not: { required: ["rankValue"] } },
      { required: ["name"] },
      { required: ["limitations"] },
    ],
    additionalProperties: false,
  },
  response: {
    200: soldierSchema,
    404: messageSchema,
  },
};

const putLimitationsSchema = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
    required: ["id"],
  },
  body: {
    type: "array",
    items: {
      type: "string",
    },
  },
  response: {
    200: soldierSchema,
  },
};

const postSoldierSchema = {
  body: {
    type: "object",
    properties: {
      _id: { type: "string", pattern: "^[0-9]{7}$" },
      name: { type: "string", minLength: 3, maxLength: 50 },
      rankValue: { type: "integer", minimum: 0, maximum: 6 },
      rankName: {
        type: "string",
        enum: [
          "private",
          "corporal",
          "sergeant",
          "lieutenant",
          "captain",
          "major",
          "colonel",
        ],
      },
      limitations: { type: "array", items: { type: "string" } },
    },
    required: ["_id", "name", "limitations"],
    oneOf: [
      { required: ["rankValue"], not: { required: ["rankName"] } },
      { required: ["rankName"], not: { required: ["rankValue"] } },
    ],
    additionalProperties: false,
  },
  response: {
    201: soldierSchema,
  },
};

const getSoldierByIDSchema = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
    required: ["id"],
  },
  response: {
    200: soldierSchema,
    404: messageSchema,
  },
};

const getSoldierByQuerySchema = {
  querystring: {
    type: "object",
    properties: {
      name: { type: "string", minLength: 3, maxLength: 50 },
      rankValue: { type: "integer", minimum: 0, maximum: 6 },
      rankName: {
        type: "string",
        enum: [
          "private",
          "corporal",
          "sergeant",
          "lieutenant",
          "captain",
          "major",
          "colonel",
        ],
      },
      limitations: { type: "array", items: { type: "string" } },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: "array",
      items: soldierSchema,
    },
  },
};

const deleteSoldierSchema = {
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

export {
  soldierSchema,
  postSoldierSchema,
  getSoldierByIDSchema,
  getSoldierByQuerySchema,
  deleteSoldierSchema,
  patchSoldierSchema,
  putLimitationsSchema,
};
