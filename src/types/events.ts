export interface TelemetryData {
  deviceId: string;
  voltage: number;
  current: number;
  powerKw: number;
  frequencyHz: number;
  temperatureC: number;
  timestamp: string;
}

export interface SystemAlert {
  alertId: string;
  deviceId: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  timestamp: string;
}

export interface ServerToClientEvents {
  telemetryStream: (data: TelemetryData) => void;
  systemAlert: (alert: SystemAlert) => void;
  roomJoined: (response: { room: string; status: string }) => void;
}

export interface ClientToServerEvents {
  subscribeDevice: (deviceId: string) => void;
  unsubscribeDevice: (deviceId: string) => void;
  acknowledgeAlert: (alertId: string, callback: (ack: { received: boolean }) => void) => void;
}

export interface SocketData {
  userId: string;
  email: string;
  role: string;
}
