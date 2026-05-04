import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDb } from './config/db.js';
import { createRuntimeDependencies } from './bootstrap/create-runtime-dependencies.js';

dotenv.config();

const port = Number(process.env.PORT || 4000);
const mongoUri = process.env.MONGODB_URI;

async function bootstrap() {
  let dbStatus = 'skipped';

  if (mongoUri) {
    await connectDb(mongoUri);
    dbStatus = 'connected';
  } else {
    console.warn('MONGODB_URI is not set; starting without a MongoDB connection.');
  }

  const runtimeDependencies = createRuntimeDependencies();
  const app = createApp({
    getDbStatus: () => dbStatus,
    holidayPlannerService: runtimeDependencies.holidayPlannerService
  });
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
