import { loadEnv } from './config/env.js';
import connectDB from './config/db.js';
import app from './app.js';

const startServer = async () => {
  try {
    loadEnv();
    await connectDB();

    const PORT = process.env.PORT || 6969;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('💥 FAILED TO START SERVER:', error);
    process.exit(1); // Kill the process if DB connection fails
  }
};

startServer();
