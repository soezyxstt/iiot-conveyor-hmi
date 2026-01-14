'use client';

import { useEffect } from 'react';
import { useSystemStore, type SystemMode } from '@/store/system-store';
import { useConveyorStore } from '@/store/conveyor-store';
import { useMQTT } from '@/hooks/use-mqtt';
import { MQTT_TOPICS } from '@/lib/mqtt/topics';

export function ModeSelector() {
  const mode = useSystemStore((s) => s.mode);
  const set_mode = useSystemStore((s) => s.set_mode);

  // Automation Logic
  const is_automate_mode = useConveyorStore((s) => s.is_automate_mode_active);
  const { publish } = useMQTT();

  // Enforce Automate Mode
  useEffect(() => {
    if (is_automate_mode && mode !== 'automatic') {
      set_mode('automatic');
    }
  }, [is_automate_mode, mode, set_mode]);

  const handleModeChange = (newMode: SystemMode) => {
    if (is_automate_mode) return; // Locked

    if (newMode === 'manual') {
      // Publish to manual mode topic
      publish(MQTT_TOPICS.CONVEYOR_MODE_MANUAL, { "ManualMode": [true] });

      // We also verify if we need to locally unlock automate mode? 
      // The user prompt says: "if the value is false, then we allow the user to switch the mode to manual."
      // So here we assume is_automate_mode is ALREADY false if we are here.
    }

    set_mode(newMode);
  };

  return (
    <div className="flex gap-4">
      {['manual', 'automatic', 'off'].map((m) => {
        const isLocked = is_automate_mode && m !== 'automatic';

        return (
          <button
            key={m}
            disabled={isLocked}
            onClick={() => handleModeChange(m as SystemMode)}
            className={`
              flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm
              ${mode === m
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}
              ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {m.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}