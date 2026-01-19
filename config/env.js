import dotenv from 'dotenv';

export const loadEnv = () => {
  dotenv.config();

  const required = ['MONGO_URI', 'MONGO_DB_NAME'];

  required.forEach((key) => {
    if (!process.env[key]) {
      console.error(`❌ missing required env variable :${key}`);
      process.exit(1);
    }
  });
};
