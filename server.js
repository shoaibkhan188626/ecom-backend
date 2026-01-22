import { loadEnv } from "./config/env.js";

loadEnv();
import app from "./app.js";
import connectDB from "./config/db.js";
await connectDB();
