'use client';

import React from 'react';
import { useConveyorStore } from '@/store/conveyor-store';

interface ConveyorControlsProps {
  is_enabled?: boolean;
}

export function ConveyorControls({ is_enabled = true }: ConveyorControlsProps) {
  // 1. AMBIL DATA DARI STORE DIGITAL TWIN
  const outer = useConveyorStore((state) => state.outer_conveyor);
  const inner = useConveyorStore((state) => state.inner_conveyor);
  const update_conveyor = useConveyorStore((state) => state.update_conveyor);

  // 2. HELPER STATUS (Format mirip Actuator: "moving-cw", "idle")
  const getStatusText = (id: number) => {
    const target = id === 1 ? outer : inner;
    if (target.speed_rpm === 0) return 'idle'; // Kalau diam
    return `moving-${target.direction.toLowerCase()}`; // moving-cw atau moving-ccw
  };

  // 3. ACTIONS
  function rotate(id: number, direction: 'CW' | 'CCW') {
    if (is_enabled) {
      update_conveyor(id, { direction, speed_rpm: 20 });
    }
  }

  function stop(id: number) {
    if (is_enabled) {
      update_conveyor(id, { speed_rpm: 0 });
    }
  }

  return (
    <div className="space-y-4"> 
      {[1, 2].map((id) => {
        const stateText = getStatusText(id);
        
        return (
          <div key={id} className="flex flex-col gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800">
            
            {/* BARIS ATAS: Nama Conveyor & Status Text */}
            <div className="flex justify-between items-center px-1">
               <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
                 Conveyor {id}
               </span>
               {/* INI TEKS STATUSNYA */}
               <span className="text-xs text-gray-500 font-mono">
                 State: <span className={stateText !== 'idle' ? "text-blue-600 font-bold" : ""}>{stateText}</span>
               </span>
            </div>

            {/* BARIS BAWAH: Tombol-Tombol */}
            <div className="grid grid-cols-3 gap-2">
              <button
                className="py-1.5 rounded text-xs bg-blue-500 hover:bg-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                disabled={!is_enabled}
                onClick={() => rotate(id, 'CW')}
              >
                Rotate CW
              </button>

              <button
                className="py-1.5 rounded text-xs bg-purple-500 hover:bg-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                disabled={!is_enabled}
                onClick={() => rotate(id, 'CCW')}
              >
                Rotate CCW
              </button>

              <button
                className="py-1.5 rounded text-xs bg-slate-400 hover:bg-slate-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                disabled={!is_enabled}
                onClick={() => stop(id)}
              >
                Stop
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}