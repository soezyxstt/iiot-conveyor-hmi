// File: src/hooks/use-mqtt.ts (Client Hook)
'use client';

import { useEffect, useRef, useCallback } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import { useSystemStore } from '@/store/system-store';
import { usePlcStore } from '@/store/plc-store';
import { useConveyorStore } from '@/store/conveyor-store';
import { useSensorStore } from '@/store/sensor-store';
import { useActuatorStore } from '@/store/actuator-store';
import { MQTT_TOPICS, SUBSCRIBE_TOPICS } from '@/lib/mqtt/topics';
import { APP_CONFIG } from '@/lib/constants/config';

interface UseMqttReturn {
  is_connected: boolean;
  publish: (topic: string, payload: Record<string, unknown>) => void;
}

export function useMQTT(): UseMqttReturn {
  const client_ref = useRef<MqttClient | null>(null);
  const reconnect_attempts = useRef<number>(0);
  
  // Stores
  const system_store = useSystemStore();
  const plc_store = usePlcStore();
  const conveyor_store = useConveyorStore();
  const sensor_store = useSensorStore();
  const actuator_store = useActuatorStore();

  const get_broker_url = useCallback((): string => {
    if (typeof process === 'undefined' || !process.env) {
      return APP_CONFIG.MQTT_BROKER_DEV;
    }
    
    const is_production = process.env.NODE_ENV === 'production';
    return is_production 
      ? APP_CONFIG.MQTT_BROKER_PROD
      : APP_CONFIG.MQTT_BROKER_DEV;
  }, []);

  const handle_message = useCallback((topic: string, message: Buffer): void => {
    try {
      const payload = JSON.parse(message.toString());
      system_store.set_last_mqtt_update(new Date().toISOString());

      // Handle relay states
      if (topic.match(/conveyor\/relay\/\d+\/state/)) {
        const relay_id = parseInt(topic.split('/')[2]);
        plc_store.update_relay_state(relay_id, payload.state);
        return;
      }

      // Handle outer placing points
      if (topic.match(/conveyor\/outer\/point\/\d+\/state/)) {
        const point_id = parseInt(topic.split('/')[3]);
        plc_store.update_outer_point(`O${point_id}`, payload.state);
        return;
      }

      // Handle inner placing points
      if (topic.match(/conveyor\/inner\/point\/\d+\/state/)) {
        const point_id = parseInt(topic.split('/')[3]);
        plc_store.update_inner_point(`I${point_id}`, payload.state);
        return;
      }

      // Handle conveyor states
      if (topic === MQTT_TOPICS.OUTER_CONVEYOR_STATE) {
        conveyor_store.update_conveyor(1, payload);
        return;
      }

      if (topic === MQTT_TOPICS.INNER_CONVEYOR_STATE) {
        conveyor_store.update_conveyor(2, payload);
        return;
      }

      // Handle sensors
      if (topic === MQTT_TOPICS.IR_SENSOR_STATE) {
        sensor_store.update_sensor('ir', payload.state);
        return;
      }

      if (topic === MQTT_TOPICS.INDUCTIVE_SENSOR_STATE) {
        sensor_store.update_sensor('inductive', payload.state);
        return;
      }

      if (topic === MQTT_TOPICS.CAPACITIVE_SENSOR_STATE) {
        sensor_store.update_sensor('capacitive', payload.state);
        return;
      }

      // Handle actuators
      if (topic.match(/conveyor\/actuator\/\d+\/state/)) {
        const actuator_id = parseInt(topic.split('/')[2]);
        actuator_store.update_actuator(actuator_id, payload);
        return;
      }

      // Handle system config
      if (topic === MQTT_TOPICS.SYSTEM_MODE) {
        system_store.set_mode(payload.mode);
        return;
      }

      if (topic === MQTT_TOPICS.SYSTEM_SPEED) {
        system_store.set_speed_level(payload.speed_level);
        return;
      }

      if (topic === MQTT_TOPICS.POWER_ELECTRICITY) {
        system_store.set_electricity_status(payload.status);
        return;
      }
    } catch (error) {
      console.error(`Failed to parse MQTT message from ${topic}:`, error);
      system_store.set_error_message(`MQTT parsing error on ${topic}`);
    }
  }, [system_store, plc_store, conveyor_store, sensor_store, actuator_store]);

  const connect = useCallback((): void => {
    try {
      const broker_url = get_broker_url();
      
      client_ref.current = mqtt.connect(broker_url, {
        protocol: typeof window !== 'undefined' ? 'ws' : 'mqtt',
        port: typeof window !== 'undefined' ? 8883 : 1883,
        clientId: `hmi-${Math.random().toString(36).substr(2, 9)}`,
        clean: true,
        keepalive: APP_CONFIG.MQTT_KEEP_ALIVE,
        reconnectPeriod: APP_CONFIG.MQTT_RECONNECT_PERIOD * Math.pow(2, Math.min(reconnect_attempts.current, 3)),
        connectTimeout: APP_CONFIG.MQTT_CONNECT_TIMEOUT,
      });

      client_ref.current.on('connect', () => {
        console.log('MQTT Connected');
        system_store.set_mqtt_connected(true);
        system_store.set_error_message(null);
        reconnect_attempts.current = 0;

        // Subscribe to all topics
        SUBSCRIBE_TOPICS.forEach((topic) => {
          client_ref.current?.subscribe(topic, { qos: APP_CONFIG.MQTT_QOS }, (error) => {
            if (error) {
              console.error(`Failed to subscribe to ${topic}:`, error);
            }
          });
        });
      });

      client_ref.current.on('message', handle_message);

      client_ref.current.on('error', (error) => {
        console.error('MQTT Error:', error);
        system_store.set_mqtt_connected(false);
        system_store.set_error_message('MQTT connection error');
      });

      client_ref.current.on('disconnect', () => {
        system_store.set_mqtt_connected(false);
        reconnect_attempts.current += 1;
      });
    } catch (error) {
      console.error('Failed to connect MQTT:', error);
      system_store.set_error_message('Failed to initialize MQTT connection');
    }
  }, [get_broker_url, handle_message, system_store]);

  const publish = useCallback((topic: string, payload: Record<string, unknown>): void => {
    if (!client_ref.current?.connected) {
      console.warn('MQTT not connected, cannot publish');
      return;
    }

    const full_payload = {
      ...payload,
      timestamp: new Date().toISOString(),
    };

    client_ref.current.publish(topic, JSON.stringify(full_payload), { qos: APP_CONFIG.MQTT_QOS });
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (client_ref.current) {
        client_ref.current.end(true, () => {
          system_store.set_mqtt_connected(false);
        });
      }
    };
  }, [connect, system_store]);

  return {
    is_connected: system_store.mqtt_connected,
    publish,
  };
}