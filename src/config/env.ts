import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_for_socketio_realtime_demo',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  TELEMETRY_INTERVAL_MS: parseInt(process.env.TELEMETRY_INTERVAL_MS || '1000', 10)
};
