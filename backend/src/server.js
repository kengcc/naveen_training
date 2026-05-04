import { createApp } from './app.js';
import { connectDb } from './config/db.js';

const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGODB_URI;

async function bootstrap() {
  await connectDb(mongoUri);

  createApp().listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
