# IIoT Conveyor HMI

Browser-based HMI for real-time monitoring and control of an industrial conveyor system.

## Features

- MQTT communication with the industrial system
- 2D digital twin for conveyor and actuator state
- Manual and automatic modes
- Conveyor, actuator, and speed controls
- Live sensor, relay, and machine-status monitoring
- Diagnostic views
- Typed MQTT topics and payloads

## Stack

`Next.js 16` `React` `TypeScript` `MQTT.js` `Zustand` `TanStack Query` `Tailwind CSS` `SVG`

## Architecture

```text
Machine / PLC
     │ MQTT
     ▼
 IIoT Broker
     │ WebSocket MQTT
     ▼
 Browser HMI
 monitoring + controls + diagnostics
```

Broker: [iiot-broker](https://github.com/soezyxstt/iiot-broker)

## Environment

```env
NEXT_PUBLIC_MQTT_BROKER_PROD=wss://your-production-broker
NEXT_PUBLIC_MQTT_BROKER_DEV=ws://your-development-broker
NODE_ENV=development
```

Never commit broker credentials or private connection details.

## Development

```bash
npm install
npm run dev
```
