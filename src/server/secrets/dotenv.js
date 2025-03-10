import donenv from "dotenv";
donenv.config();
export const secrets = {
  port: process.env.PORT || 3000,
  node_env: process.env.NODE_ENV,
  mongo_uri: process.env.MONGO_URI,
};
