import { Server } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, SocketData, TelemetryData, SystemAlert } from '../types/events.js';

export class TelemetrySimulator {
  private timer: NodeJS.Timeout | null = null;
  private monitoredDevices = ['meter-plant-01', 'meter-plant-02', 'transformer-sub-04'];

  constructor(private io: Server<ClientToServerEvents, ServerToClientEvents, any, SocketData>) {}

  start(intervalMs = 1000): void {
    if (this.timer) return;

    this.timer = setInterval(() => {
      for (const deviceId of this.monitoredDevices) {
        const voltage = +(220 + (Math.random() * 10 - 5)).toFixed(1);
        const current = +(15 + (Math.random() * 4 - 2)).toFixed(2);
        const powerKw = +((voltage * current) / 1000).toFixed(2);

        const payload: TelemetryData = {
          deviceId,
          voltage,
          current,
          powerKw,
          frequencyHz: +(50.0 + (Math.random() * 0.4 - 0.2)).toFixed(2),
          temperatureC: +(42.0 + Math.random() * 5).toFixed(1),
          timestamp: new Date().toISOString()
        };

        // Broadcast to device-specific room
        this.io.to(`device:${deviceId}`).emit('telemetryStream', payload);

        // Anomaly trigger (e.g. over-voltage alarm)
        if (voltage > 224.5) {
          const alert: SystemAlert = {
            alertId: `alt_${Date.now()}`,
            deviceId,
            severity: 'CRITICAL',
            message: `Overvoltage condition detected: ${voltage}V exceeded safety threshold (224V)`,
            timestamp: new Date().toISOString()
          };
          this.io.to(`device:${deviceId}`).emit('systemAlert', alert);
        }
      }
    }, intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
