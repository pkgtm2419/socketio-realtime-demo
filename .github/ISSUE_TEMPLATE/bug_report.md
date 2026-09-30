---
name: Bug Report
about: Report an unexpected WebSocket, telemetry, or server error
title: '[BUG]: '
labels: ['bug', 'triage']
assignees: ['pkgtm2419']
---

### Describe the Bug
A clear description of the socket connection, telemetry streaming, or authentication failure.

### Steps to Reproduce
1. Start the server with `npm run dev`
2. Connect socket client with handshake auth token `...`
3. Join room `...` or emit event `...`
4. Observe failure / disconnect

### Expected Behavior
A clear description of what you expected to happen.

### Environment & Context
- OS: [e.g. Ubuntu 22.04, Windows 11, macOS 14]
- Node.js Version: [e.g. 20.11.0, 22.10.0]
- Socket.IO Client Version: [e.g. 4.8.1]

### Relevant Logs / Error Output
```text
Paste socket client or server debug logs here
```
