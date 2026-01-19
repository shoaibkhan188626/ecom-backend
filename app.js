import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/error.middleware.js";
import AppError from "./utils/appError.js";
import honeypot from "./middlewares/honeypot.middleware.js";
import { apiRateLimit } from "./middlewares/rateLimit.middleware.js";

const app = express();

app.set("trust proxy", true);
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(hpp());
app.use(honeypot);
app.use("/api", apiRateLimit);
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timeStamp: new Date().toISOString(),
  });
});
app.use("/api", routes);
app.all(/.*$/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler);
export default app;
