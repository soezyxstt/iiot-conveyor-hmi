'use client';

import React from 'react';
import { useConveyorStore } from '@/store/conveyor-store';
import { useMQTT } from '@/hooks/use-mqtt';
import { MQTT_TOPICS } from '@/lib/mqtt/topics';

interface ConveyorControlsProps {
  is_enabled?: boolean;
}

export function ConveyorControls({ is_enabled = true }: ConveyorControlsProps) {
  // Access store for display
  const outer = useConveyorStore((state) => state.outer_conveyor);
  const inner = useConveyorStore((state) => state.inner_conveyor);
  const update_conveyor = useConveyorStore((state) => state.update_conveyor);
  const { publish } = useMQTT();

  const getStatusText = (id: number) => {
    const target = id === 1 ? outer : inner;
    // Check if moving (is_running or speed > 0)
    return (target.is_running || target.motorSpeedSensor > 0) ? 'Running' : 'Stopped'; 
  };

  async function toggleRun(id: number, run: boolean) {
    if (is_enabled) {
      // Optimistic update
      // Assuming a default speed of 20 when running for visual feedback
      update_conveyor(id, { is_running: run, motorSpeedSensor: run ? 20 : 0 });

      const topic = id === 1
        ? MQTT_TOPICS.STEPPER_OUTER
        : MQTT_TOPICS.STEPPER_INNER;

      const nickname = id === 1 ? 'Stepper_Out' : 'Stepper_In';

      // Payload format: { "Nickname": [ boolean ] }
      const payload = {
        [nickname]: [run]
      };

      publish(topic, payload);
    }
  }

  return (
    <div className="space-y-4"> 
      {[1, 2].map((id) => {
        const title = id === 1 ? "Outer Conveyor" : "Inner Conveyor";
        const stateText = getStatusText(id);
        const isRunning = stateText === 'Running';
        
        return (
          <div key={id} className="flex flex-col gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800">

            <div className="flex justify-between items-center px-1">
               <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
                {title}
              </span>
               <span className="text-xs text-gray-500 font-mono">
                State: <span className={isRunning ? "text-green-600 font-bold" : ""}>{stateText}</span>
               </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                className={`py-1.5 rounded text-xs font-medium transition-all shadow-sm active:scale-95 ${isRunning ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                disabled={!is_enabled || isRunning}
                onClick={() => toggleRun(id, true)}
              >
                Start
              </button>

              <button
                className={`py-1.5 rounded text-xs font-medium transition-all shadow-sm active:scale-95 ${!isRunning ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                disabled={!is_enabled || !isRunning}
                onClick={() => toggleRun(id, false)}
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