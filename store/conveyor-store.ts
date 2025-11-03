// File: src/store/conveyor-store.ts
'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { ConveyorState, ConveyorDirection } from '@/types';

interface ConveyorStoreState {
  outer_conveyor: ConveyorState;
  inner_conveyor: ConveyorState;
  
  // Actions
  update_conveyor: (conveyor_id: number, data: Partial<ConveyorState>) => void;
  get_conveyor: (conveyor_id: number) => ConveyorState;
}

const create_initial_conveyor = (conveyor_id: number): ConveyorState => ({
  conveyor_id,
  direction: 'CW' as const,
  angle_deg: 0,
  position: 0,
  speed_rpm: 0,
  timestamp: new Date().toISOString(),
});

export const useConveyorStore = create<ConveyorStoreState>()(
  subscribeWithSelector((set, get) => ({
    outer_conveyor: create_initial_conveyor(1),
    inner_conveyor: create_initial_conveyor(2),
    
    update_conveyor: (conveyor_id: number, data: Partial<ConveyorState>) =>
      set((store) => ({
        [conveyor_id === 1 ? 'outer_conveyor' : 'inner_conveyor']: {
          ...(conveyor_id === 1 ? store.outer_conveyor : store.inner_conveyor),
          ...data,
          timestamp: new Date().toISOString(),
        },
      })),
    
    get_conveyor: (conveyor_id: number) => {
      const store = get();
      return conveyor_id === 1 ? store.outer_conveyor : store.inner_conveyor;
    },
  }))
);

