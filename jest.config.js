export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules"],
  moduleFileExtensions: ["js", "json", "jsx", "node"],
  globals: {
    __DEV__: true,
    __MONGO_URI__: "mongodb://localhost:27017/",
    __MONGO_DB_NAME__: "CallOfDuty",
    API_URL: "http://localhost:3000",
    MAX_RETRIES: 3,
  },
  preset: "@shelf/jest-mongodb",
};
