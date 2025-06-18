import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { config } from '@/config/environment';
import { logger } from '@/utils/logger';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { authMiddleware } from '@/middleware/auth';

// Import module routes
import authRoutes from '@/modules/auth/auth.routes';
import clientRoutes from '@/modules/client/client.routes';
import vehiculeRoutes from '@/modules/vehicule/vehicule.routes';
import prestationRoutes from '@/modules/prestation/prestation.routes';
import devisRoutes from '@/modules/devis/devis.routes';
import dashboardRoutes from '@/modules/dashboard/dashboard.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// General middleware
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// API routes - Module-based routing
app.use('/api/auth', authRoutes);
app.use('/api/clients', authMiddleware, clientRoutes);
app.use('/api/vehicules', authMiddleware, vehiculeRoutes);
app.use('/api/prestations', authMiddleware, prestationRoutes);
app.use('/api/devis', authMiddleware, devisRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port || 3001;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
  logger.info(`📁 Modular architecture initialized with separate module controllers`);
});

export default app;