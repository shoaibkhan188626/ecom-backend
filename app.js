import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';

import rateLimit from 'express-rate-limit';
import errorHandler from './middlewares/error.middleware.js';
import AppError from './utils/appError.js';
import routes from './routes/index.js';

const app = express();

// --- 1. GLOBAL MIDDLEWARES ---
app.set('trust proxy', true);

// Set security HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing
// This allows all origins, methods, and headers
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Body parser, reading data from body into req.body (limit 10kb)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Prevent parameter pollution
app.use(hpp());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// --- 2. ROUTES ---

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Apply rate limiter to API routes only
// app.use('/api', limiter);

// Mount API routes
app.use('/api', routes);

// --- 3. ERROR HANDLING ---

// Catch-all route for undefined paths
// Using Regex /.*$/ to avoid path-to-regexp v8 compatibility issues
app.all(/.*$/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Middleware (Must be defined last)
app.use(errorHandler);

export default app;
