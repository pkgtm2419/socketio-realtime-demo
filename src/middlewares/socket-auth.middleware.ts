import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { SocketData } from '../types/events.js';

export const socketAuthMiddleware = (socket: Socket<any, any, any, SocketData>, next: (err?: Error) => void) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');

  if (!token) {
    return next(new Error('Authentication error: Missing handshake token'));
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; email: string; role: string };
    socket.data.userId = decoded.id;
    socket.data.email = decoded.email;
    socket.data.role = decoded.role;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid or expired token'));
  }
};
