import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import createApiRouter from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp({ getDbStatus, holidayPlannerService } = {}) {
  const app = express();
  const readDbStatus = typeof getDbStatus === 'function' ? getDbStatus : () => 'unknown';

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      db: readDbStatus()
    });
  });

  app.use('/api', createApiRouter({ holidayPlannerService }));
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
