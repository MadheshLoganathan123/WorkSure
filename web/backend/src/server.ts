import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes';
import adminRoutes from './routes/admin.routes';
import logger, { morganMiddleware } from './utils/logger';
import { errorMiddleware } from './middleware/error.middleware';
import { seedDevelopmentData } from './utils/seedData';

const app: Express = express();
const PORT = process.env.PORT || 3002;

// ── Core Middleware ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

// ── Routes ───────────────────────────────────────────────────────────────
app.use('/health', healthRoutes);
app.use('/api/v1/admin', adminRoutes);

// ── Global Error Handler (must be last) ──────────────────────────────────
app.use(errorMiddleware);

// ── Start Server ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`WorkSure Web Admin API running at http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Seed development data
  if (process.env.NODE_ENV !== 'production') {
    seedDevelopmentData();
  }
});

export default app;
