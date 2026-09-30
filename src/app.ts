import express from 'express';
import cors from 'cors';
import path from 'path';
import { ENV } from './config/env.js';

export function createExpressApp() {
  const app = express();
  app.use(cors({ origin: ENV.CORS_ORIGIN }));
  app.use(express.json());

  // Static files for client test UI
  app.use(express.static(path.join(process.cwd(), 'public')));

  app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: 'socketio-realtime-demo', timestamp: new Date().toISOString() });
  });

  return app;
}
