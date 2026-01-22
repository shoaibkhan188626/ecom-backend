import dotenv from "dotenv";

export const loadEnv = () => {
  dotenv.config();

  const requiredVars = [
    //environment variables
    "NODE_ENV",

    //database
    "MONGO_URI",

    //Auth
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_EXPIRES",

    //Redis
    "REDIS_URL",
  ];

  for (const key of requiredVars) {
    if (!process.env[key]) {
      console.error(`Missing required env variables:${key}`);
      process.exit(1);
    }
  }
};

export const env = {
  nodeEnv: process.env.NODE_ENV,

  mongoUri: process.env.MONGO_URI,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpires: process.env.JWT_ACCESS_EXPIRES,
    refreshExpires: process.env.JWT_REFRESH_EXPIRES,
  },

  redisUrl: process.env.REDIS_URL,

  isProd: process.env.NODE_ENV === "production",
  isDev: process.env.NODE_ENV === "development",
};
