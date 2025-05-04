import dotenv from 'dotenv';
dotenv.config();

export const secrets = {
  port: process.env.PORT || 3000,
  node_env: process.env.NODE_ENV,
  mongo_uri: process.env.MONGO_URI || 'mongodb://localhost:27017/CallOfDuty',
  fake_db_uri:
    process.env.FAKE_DB_URI || 'mongodb://localhost:27017/CallOfDuty_fake'
};
