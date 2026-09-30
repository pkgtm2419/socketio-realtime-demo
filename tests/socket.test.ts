import http from 'http';
import { Server } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import jwt from 'jsonwebtoken';
import { createExpressApp } from '../src/app.js';
import { socketAuthMiddleware } from '../src/middlewares/socket-auth.middleware.js';
import { ENV } from '../src/config/env.js';

describe('Socket.IO Real-Time Telemetry Tests', () => {
  let httpServer: http.Server;
  let ioServer: Server;
  let clientSocket: ClientSocket;
  let port: number;

  const validToken = jwt.sign({ id: 'usr_test', email: 'test@iot.com', role: 'engineer' }, ENV.JWT_SECRET);

  beforeAll((done) => {
    const app = createExpressApp();
    httpServer = http.createServer(app);
    ioServer = new Server(httpServer);
    ioServer.use(socketAuthMiddleware);

    ioServer.on('connection', (socket) => {
      socket.on('subscribeDevice', (deviceId: string) => {
        socket.join(`device:${deviceId}`);
        socket.emit('roomJoined' as any, { room: `device:${deviceId}`, status: 'SUCCESS' });
      });

      socket.on('acknowledgeAlert', (alertId: string, cb: any) => {
        if (typeof cb === 'function') cb({ received: true });
      });

      socket.on('pingCheck', (clientTimestamp: number, cb: any) => {
        const payload = { clientTimestamp, serverTimestamp: Date.now() };
        socket.emit('pongAck' as any, payload);
        if (typeof cb === 'function') cb(payload);
      });
    });

    httpServer.listen(() => {
      const addr = httpServer.address();
      port = typeof addr === 'string' ? 4000 : addr!.port;
      done();
    });
  });

  afterAll((done) => {
    ioServer.close();
    httpServer.close(done);
  });

  afterEach(() => {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  it('should reject connection when auth token is missing', (done) => {
    clientSocket = Client(`http://localhost:${port}`, {
      transports: ['websocket'],
      auth: {}
    });

    clientSocket.on('connect_error', (err) => {
      expect(err.message).toContain('Authentication error: Missing handshake token');
      done();
    });
  });

  it('should connect successfully with valid JWT handshake token', (done) => {
    clientSocket = Client(`http://localhost:${port}`, {
      transports: ['websocket'],
      auth: { token: validToken }
    });

    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });
  });

  it('should join device room and receive confirmation', (done) => {
    clientSocket = Client(`http://localhost:${port}`, {
      transports: ['websocket'],
      auth: { token: validToken }
    });

    clientSocket.on('connect', () => {
      clientSocket.emit('subscribeDevice', 'meter-plant-01');
    });

    clientSocket.on('roomJoined', (data: any) => {
      expect(data.room).toBe('device:meter-plant-01');
      expect(data.status).toBe('SUCCESS');
      done();
    });
  });

  it('should measure round-trip latency via pingCheck and pongAck', (done) => {
    clientSocket = Client(`http://localhost:${port}`, {
      transports: ['websocket'],
      auth: { token: validToken }
    });

    clientSocket.on('connect', () => {
      const clientTs = Date.now();
      clientSocket.emit('pingCheck', clientTs, (pong: any) => {
        expect(pong.clientTimestamp).toBe(clientTs);
        expect(pong.serverTimestamp).toBeGreaterThanOrEqual(clientTs);
        done();
      });
    });
  });
});
