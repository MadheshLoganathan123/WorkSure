import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes';
import profileRoutes from './routes/profile.routes';
import monitoringRoutes from './routes/monitoring.routes';
import walletRoutes from './routes/wallet.routes';
import claimsRoutes from './routes/claims.routes';
import logger, { morganMiddleware } from './utils/logger';
import { errorMiddleware } from './middleware/error.middleware';
import { seedDevelopmentData } from './utils/seedData';

const app: Express = express();
const PORT = process.env.PORT || 3001;

// ── Core Middleware ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

// ── Routes ───────────────────────────────────────────────────────────────
app.use('/health', healthRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/weather', monitoringRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/claims', claimsRoutes);

// ── Global Error Handler (must be last) ──────────────────────────────────
app.use(errorMiddleware);

// ── Start Server ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`WorkSure Mobile API running at http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Seed development data
  if (process.env.NODE_ENV !== 'production') {
    seedDevelopmentData().then(() => {
      logger.info('🌱 Seeding process finished');
    }).catch(err => {
      logger.error('❌ Seeding failed:', err);
    });
  }
});

export default app;
