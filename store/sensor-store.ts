// File: src/store/sensor-store.ts
'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { BooleanSensorStatus, BooleanSensorType } from '@/types';

interface SensorStoreState {
  // Boolean Sensors
  ir_sensor: BooleanSensorStatus;
  inductive_sensor: BooleanSensorStatus;
  capacitive_sensor: BooleanSensorStatus;
  position_inner_sensor: BooleanSensorStatus;
  position_outer_sensor: BooleanSensorStatus;

  // Data Sensors
  motor_speed: number;
  object_inner_count: number;
  object_outer_count: number;
  
  // Actions
  update_boolean_sensor: (sensor_type: BooleanSensorType, state: boolean) => void;
  update_data_sensor: (type: 'motor_speed' | 'object_inner' | 'object_outer', value: number) => void;
}

const create_initial_sensor = (sensor: BooleanSensorType): BooleanSensorStatus => ({
  sensor,
  state: false,
  timestamp: new Date().toISOString(),
});

export const useSensorStore = create<SensorStoreState>()(
  subscribeWithSelector((set) => ({
    ir_sensor: create_initial_sensor('ir'),
    inductive_sensor: create_initial_sensor('inductive'),
    capacitive_sensor: create_initial_sensor('capacitive'),
    position_inner_sensor: create_initial_sensor('position_inner'),
    position_outer_sensor: create_initial_sensor('position_outer'),

    motor_speed: 0,
    object_inner_count: 0,
    object_outer_count: 0,
    
    update_boolean_sensor: (sensor_type: BooleanSensorType, state: boolean) =>
      set((store) => ({
        [`${sensor_type}_sensor` as const]: {
          ...(store[`${sensor_type}_sensor` as keyof SensorStoreState] as BooleanSensorStatus),
          state,
          timestamp: new Date().toISOString(),
        },
      })),

    update_data_sensor: (type, value) => 
      set((store) => {
        switch(type) {
          case 'motor_speed': return { motor_speed: value };
          case 'object_inner': return { object_inner_count: value };
          case 'object_outer': return { object_outer_count: value };
          default: return {};
        }
      }),
  }))
);
