import http from 'http';
import { Server } from 'socket.io';
import { createExpressApp } from './app.js';
import { ENV } from './config/env.js';
import { socketAuthMiddleware } from './middlewares/socket-auth.middleware.js';
import { TelemetrySimulator } from './services/telemetry-simulator.service.js';
import { ClientToServerEvents, ServerToClientEvents, SocketData } from './types/events.js';

const app = createExpressApp();
const server = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, any, SocketData>(server, {
  cors: {
    origin: ENV.CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

// Attach Authentication Middleware
io.use(socketAuthMiddleware);

// Socket Event Handlers
io.on('connection', (socket) => {
  console.log(`[SOCKET CONNECTED] ID: ${socket.id}, User: ${socket.data.email} (${socket.data.role})`);

  socket.on('subscribeDevice', (deviceId: string) => {
    const roomName = `device:${deviceId}`;
    socket.join(roomName);
    console.log(`[ROOM JOIN] Socket ${socket.id} joined room: ${roomName}`);
    socket.emit('roomJoined', { room: roomName, status: 'SUCCESS' });
  });

  socket.on('unsubscribeDevice', (deviceId: string) => {
    const roomName = `device:${deviceId}`;
    socket.leave(roomName);
    console.log(`[ROOM LEAVE] Socket ${socket.id} left room: ${roomName}`);
  });

  socket.on('acknowledgeAlert', (alertId: string, callback) => {
    console.log(`[ALERT ACKNOWLEDGED] Alert ${alertId} acknowledged by user ${socket.data.email}`);
    if (typeof callback === 'function') {
      callback({ received: true });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`[SOCKET DISCONNECTED] ID: ${socket.id}, Reason: ${reason}`);
  });
});

// Start Simulated Telemetry Stream
const simulator = new TelemetrySimulator(io);
if (ENV.NODE_ENV !== 'test') {
  simulator.start(ENV.TELEMETRY_INTERVAL_MS);
}

server.listen(ENV.PORT, () => {
  console.log(`⚡ Real-time Socket.IO server running on http://localhost:${ENV.PORT}`);
});

export { server, io, simulator };
