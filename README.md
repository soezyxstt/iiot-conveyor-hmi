# IIoT Conveyor HMI

Web-based human-machine interface for monitoring and controlling an industrial conveyor system in real time.

The application connects to MQTT infrastructure, visualizes machine state through a 2D digital twin, exposes operator controls, and provides diagnostic views for sensors, actuators, relays, and placing points.

## Engineering highlights

- Real-time MQTT communication between the browser and industrial system
- 2D digital twin for conveyor and actuator state
- Manual and automatic operating modes
- Operator controls for conveyors, actuators, and speed settings
- Live sensor, relay, and machine-status monitoring
- Diagnostic tooling for system inspection and troubleshooting
- Centralized client state using Zustand
- Typed MQTT topic and payload definitions
- Dark/light interface designed for HMI use

## Stack

- **Next.js 16**
- **React + TypeScript**
- **MQTT.js**
- **Zustand**
- **TanStack Query**
- **Tailwind CSS / shadcn-style UI components**
- **SVG** for the digital twin visualization

## Architecture

```text
Machine / PLC
     │
     │ MQTT
     ▼
IIoT Broker ───────── Remote MQTT infrastructure
     │
     │ WebSocket MQTT
     ▼
Browser HMI
 ├─ Monitoring
 ├─ Controls
 ├─ Diagnostics
 └─ 2D Digital Twin
```

The broker used by this project is maintained separately:

- [iiot-broker](https://github.com/soezyxstt/iiot-broker)

## Environment setup

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_MQTT_BROKER_PROD=wss://your-production-broker
NEXT_PUBLIC_MQTT_BROKER_DEV=ws://your-development-broker
NODE_ENV=development
```

Never commit production broker credentials or private connection details.

## Local development

```bash
npm install
npm run dev
```

Then open the local Next.js development URL in a browser.

## Main application areas

```text
src/
├── app/             # Routes and application shell
├── components/
│   ├── monitoring/  # Digital twin, sensors, status
│   ├── controls/    # Conveyor, actuator, mode, speed controls
│   ├── diagnostics/ # Relay and system diagnostics
│   └── common/      # Shared HMI components
├── hooks/           # MQTT and domain hooks
├── lib/mqtt/        # Client, topics, schemas
├── store/           # Zustand state stores
└── types/           # Shared TypeScript types
```

## Project context

This project demonstrates a full web-to-machine IIoT workflow: MQTT transport, machine-state synchronization, industrial controls, diagnostics, and browser-based visualization.
