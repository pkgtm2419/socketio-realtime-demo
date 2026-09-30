import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from './config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createExpressApp() {
  const app = express();
  app.use(cors({ origin: ENV.CORS_ORIGIN }));
  app.use(express.json());

  // Static files for client test UI
  app.use(express.static(path.join(__dirname, '../public')));

  app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: 'socketio-realtime-demo', timestamp: new Date().toISOString() });
  });

  return app;
}
