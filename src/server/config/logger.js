import { secrets } from "../secrets/dotenv.js";

const isDev = secrets.node_env === "development";

export const loggerConfig = isDev
  ? {
      level: "info",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    }
  : {
      level: "silent",
    };
