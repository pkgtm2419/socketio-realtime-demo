# Contributing to socketio-realtime-demo

Thank you for your interest in contributing to `socketio-realtime-demo`! We build high-throughput, secure real-time streaming services with TypeScript, Socket.IO, and Redis.

---

## Code of Conduct
We maintain a safe, welcoming, and collaborative space for all developers. Please treat everyone with dignity, empathy, and professional respect.

---

## Local Development Setup

1. **Prerequisites:**
   - Node.js >= 18.0.0
   - npm >= 9.0.0

2. **Installation:**
   ```bash
   git clone https://github.com/pkgtm2419/socketio-realtime-demo.git
   cd socketio-realtime-demo
   npm ci
   cp .env.example .env
   ```

3. **Running the Server & Dashboard:**
   ```bash
   # Development server with live reloads
   npm run dev

   # Open browser UI at http://localhost:4000 to interact with the dashboard
   ```

4. **Testing & Quality Gates:**
   ```bash
   # Run static type checking
   npm run lint

   # Compile TypeScript
   npm run build

   # Run automated socket tests
   npm test
   ```

---

## Branching & Commit Standards

- Feature branches: `feat/event-replay` or `fix/handshake-timeout`
- Conventional Commits:
  - `feat(socket)`: New event or room feature
  - `fix(telemetry)`: Bug fix in simulation or transport
  - `docs(...)`: README or sequence diagram updates
  - `test(...)`: Expanding socket test assertions
